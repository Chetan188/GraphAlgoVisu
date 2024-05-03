from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from.import views
from django.conf import settings
from django.conf.urls.static import static
#Reset
from django.contrib.auth import views as auth_views 

admin.site.site_header = "GraphAlgoriThmVisU Admin"
admin.site.site_title = "GraphAlgoriThmVisU Admin Panel"
admin.site.index_title = "Welcome GraphAlgoriThmVisU Admin Panel"

urlpatterns = [
    path('', views.home, name="home"),
    path('GAVModule/', views.GAVModule, name="GAVModule"),
    path('about/', views.about, name="about"),
    path('contact/', views.contact, name="contact"),
    path('help/', views.help, name="help"),
    path('info/', views.info, name="info"),
    path('login1/', views.login1, name="login1"),
    path('registration/', views.registration, name="registration"),
    path('profile/', views.profile, name="profile"),
    path('edit_profile', views.edit_profile, name="edit_profile"),
    path('logout/', views.handleLogout, name="handleLogout"),
    
    
    path('password_reset/',auth_views.PasswordResetView.as_view(),name='password_reset'),
    path('password_reset/done/',auth_views.PasswordResetDoneView.as_view(),name='password_reset_done'),
    path('reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(),name='password_reset_confirm'),
    path('reset/done/',auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete')

    # path('change_password/<token>/', views.change_password, name="change_password"),
    # path('forgot_password', views.forgot_password, name="forgot_password"),
     
]

