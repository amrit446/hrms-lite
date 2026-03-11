from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Employee, Attendance
from .serializers import EmployeeSerializer, AttendanceSerializer


# ────────────────────────────────────────────────
# Employee APIs
# ────────────────────────────────────────────────

class EmployeeListCreateView(APIView):
    """
    GET  /api/employees/  – list all employees
    POST /api/employees/  – create a new employee
    """

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        employees = Employee.objects.all()
        if search:
            employees = employees.filter(
                Q(full_name__icontains=search) |
                Q(employee_id__icontains=search) |
                Q(department__icontains=search)
            )
        serializer = EmployeeSerializer(employees, many=True)
        return Response({
            'count': employees.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class EmployeeDetailView(APIView):
    """
    GET    /api/employees/{id}/ – retrieve single employee
    DELETE /api/employees/{id}/ – delete employee
    """

    def get(self, request, pk):
        employee = get_object_or_404(Employee, pk=pk)
        serializer = EmployeeSerializer(employee)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        employee = get_object_or_404(Employee, pk=pk)
        name = employee.full_name
        employee.delete()
        return Response(
            {'message': f"Employee '{name}' deleted successfully."},
            status=status.HTTP_200_OK
        )


# ────────────────────────────────────────────────
# Attendance APIs
# ────────────────────────────────────────────────

class AttendanceListCreateView(APIView):
    """
    GET  /api/attendance/  – list all attendance records (with optional filters)
    POST /api/attendance/  – mark attendance
    """

    def get(self, request):
        attendances = Attendance.objects.select_related('employee').all()

        # Filter by date
        date = request.query_params.get('date', '').strip()
        if date:
            attendances = attendances.filter(date=date)

        # Filter by employee_id (the string employee_id, not PK)
        employee_id = request.query_params.get('employee_id', '').strip()
        if employee_id:
            attendances = attendances.filter(employee__employee_id=employee_id)

        # Filter by status
        status_filter = request.query_params.get('status', '').strip()
        if status_filter:
            attendances = attendances.filter(status=status_filter)

        serializer = AttendanceSerializer(attendances, many=True)
        return Response({
            'count': attendances.count(),
            'results': serializer.data
        }, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            employee = serializer.validated_data['employee']
            date = serializer.validated_data['date']
            new_status = serializer.validated_data['status']

            # Update existing record or create new one
            attendance, created = Attendance.objects.update_or_create(
                employee=employee,
                date=date,
                defaults={'status': new_status},
            )
            result = AttendanceSerializer(attendance).data
            result['updated'] = not created
            return Response(result, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class AttendanceToggleView(APIView):
    """
    PATCH /api/attendance/toggle/{id}/
        – toggle attendance status between Present and Absent
    """

    def patch(self, request, pk):
        attendance = get_object_or_404(Attendance, pk=pk)
        # Flip the status
        attendance.status = 'Absent' if attendance.status == 'Present' else 'Present'
        attendance.save()
        serializer = AttendanceSerializer(attendance)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EmployeeAttendanceView(APIView):
    """
    GET /api/attendance/{employee_id}/
        – all attendance records for a specific employee (by employee_id string)
        – also returns summary: total days, present, absent
    """

    def get(self, request, employee_id):
        employee = get_object_or_404(Employee, employee_id=employee_id)
        attendances = Attendance.objects.filter(employee=employee).order_by('-date')

        # Optional date filter
        date = request.query_params.get('date', '').strip()
        if date:
            attendances = attendances.filter(date=date)

        serializer = AttendanceSerializer(attendances, many=True)

        total = attendances.count()
        present = attendances.filter(status='Present').count()
        absent = attendances.filter(status='Absent').count()

        return Response({
            'employee': {
                'id': employee.pk,
                'employee_id': employee.employee_id,
                'full_name': employee.full_name,
                'department': employee.department,
            },
            'summary': {
                'total_days': total,
                'present': present,
                'absent': absent,
            },
            'results': serializer.data
        }, status=status.HTTP_200_OK)


# ────────────────────────────────────────────────
# Dashboard summary
# ────────────────────────────────────────────────

class DashboardSummaryView(APIView):
    """
    GET /api/dashboard/ – overview counts
    """

    def get(self, request):
        total_employees = Employee.objects.count()
        total_attendance = Attendance.objects.count()
        total_present = Attendance.objects.filter(status='Present').count()
        total_absent = Attendance.objects.filter(status='Absent').count()

        return Response({
            'total_employees': total_employees,
            'total_attendance': total_attendance,
            'total_present': total_present,
            'total_absent': total_absent,
        }, status=status.HTTP_200_OK)
