
from django.urls import path
from .views import (
    register,
    login,
    logout,
    application_list,
    application_detail,
)

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('logout/', logout),
    path('applications/', application_list),
    path('applications/<int:pk>/', application_detail),
]
