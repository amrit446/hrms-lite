from django.urls import path
from . import views

urlpatterns = [
    # Employee endpoints
    path('employees/', views.EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', views.EmployeeDetailView.as_view(), name='employee-detail'),

    # Attendance endpoints
    path('attendance/', views.AttendanceListCreateView.as_view(), name='attendance-list-create'),
    path('attendance/toggle/<int:pk>/', views.AttendanceToggleView.as_view(), name='attendance-toggle'),
    path('attendance/<str:employee_id>/', views.EmployeeAttendanceView.as_view(), name='employee-attendance'),

    # Dashboard
    path('dashboard/', views.DashboardSummaryView.as_view(), name='dashboard-summary'),
]
