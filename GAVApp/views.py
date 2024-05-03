from email import message
from tkinter import FALSE
from django.http import HttpResponse
from django.http.request import validate_host
from django.http.response import HttpResponseRedirect
from django.shortcuts import render, redirect
import GAVApp
from .models import *
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
import json

 
def home(request):
    if request.method == "POST":
        name = request.POST['name']
        email = request.POST['email']
        feedbackMsg = request.POST['feedback']
        if len(name) < 2 or len(email) < 3 or len(feedbackMsg) < 4:
            messages.warning(request, "Please fill the form correctly")
        else:
            contact = Feedback(name=name, email=email,
                              feedbackMsg=feedbackMsg)
            contact.save()
            messages.info(
                request, "Your feedback has been successfully sent")
    
    feedbackData = Feedback.objects.all()
    print(feedbackData)
    faqData = FAQ.objects.all()
    return render(request, "GAVApp/home.html", {'post':feedbackData, 'faq':faqData})

def info(request):
    return render(request, "GAVApp/info.html")

def about(request):
    return render(request, "GAVApp/about.html")

@login_required
def GAVModule(request):
    if request.user.is_anonymous:
        messages.error(request, 'Make sure you are logged in to access advanced functionality!!')
        return redirect("login1")
    
    algorithms = LearnMore.objects.all()
    context = {
        'algorithms':algorithms,
        }
    
    return render(request, "GAVApp/GAVModule.html", context)
        
def contact(request):
    if request.method == "POST":
        name = request.POST['name']
        email = request.POST['email']
        phone = request.POST['phone']
        Issue = request.POST['content']
        if len(name) < 2 or len(email) < 3 or len(phone) < 10 or len(Issue) < 4:
            messages.warning(request, "Please fill the form correctly")
        else:
            contact = Contact(name=name, email=email,
                              phone=phone, Issue=Issue)
            contact.save()
            messages.info(
                request, "Your message has been successfully sent")

    return render(request, "GAVApp/contact.html")


def profile(request):
    if request.user.is_authenticated:
        return render(request, "GAVApp/profile.html")

    return HttpResponse("404 - Not Found")


def edit_profile(request):
    if request.method == "POST":
        un = request.POST['username']
        fn = request.POST['fname']
        ln = request.POST['lname']
        em = request.POST['email']

        user = User.objects.get(id=request.user.id)
        user.username = un
        user.first_name = fn
        user.last_name = ln
        user.email = em

        user.save()
        messages.info(
            request, f"{request.user} is updated his Profile successfully!!!")
        return redirect("profile")

    return render(request, "GAVApp/profile.html")

def help(request):
    return render(request, "GAVApp/help.html")

def registration(request):
    if request.method == 'POST':
        username = request.POST['uname']
        fname = request.POST['fname']
        lname = request.POST['lname']
        email = request.POST['email']
        pass1 = request.POST['pass1']
        pass2 = request.POST['pass2']

        # checks for errorneous
        # username should be under 10 characters
        if len(username) > 10:
            messages.error(
                request, 'Username must be under 10 characters')
            return redirect("registration")
        
        # user should be alphanumeric
        if not username.isalnum():
            messages.error(
                request, 'Username should only contain letters and numbers')
            return redirect("registration")

        if User.objects.filter(username=username).exists():
            messages.error(
                request, 'Username is already taken, Please try with different !')
            return redirect("registration")

        if User.objects.filter(email=email).exists():
            messages.error(
                request, 'Email is already taken, Please try with different !')
            return redirect("registration")

        # passwortds should match
        if pass1 != pass2:
            messages.error(request, 'Password do not match')
            return redirect("registration")

        # Create the user
        myuser = User.objects.create_user(username, email, pass1)
        myuser.first_name = fname
        myuser.last_name = lname

        myuser.save()
        messages.info(
            request, "Your GrapgAlgoriThmVisU account has been created successfully! kindly please login..")
        return redirect("login1")

    else:
        return render(request, "registration.html")


def login1(request):
    if request.method == 'POST':
        loginusername = request.POST['loginusername']
        loginpassword = request.POST['loginpassword']

        user = authenticate(username=loginusername, password=loginpassword)

        if user is not None:
            login(request, user)
            messages.info(request, "successfully logged in !")
            return redirect("home")
        else:
            messages.error(request, "Invalid Credentials, Please try again!")
            return redirect("login1")

    return render(request, "login1.html")


def handleLogout(request):
    logout(request)
    # messages.success(request, "Successfully logged out !")
    return redirect("home")

# def change_password(request, token):
#     context = {}
    
#     try:
#         profile_obj = Profile.objects.filter(forgot_password_token = token).first()
#         print(profile_obj)
        
#     except Exception as e:
#         print(e)
#     return render(request, "change_password.html")

# import uuid 
# def forgot_password(request):
#     # return HttpResponse("I am in change password")
#     try:
#         if request.method == 'POST':
#             username = request.POST.get('username')
            
#             if not User.objects.filter(username=username).first():
#                 messages.error(request, 'Not user found with this username')
#                 return redirect("forgot_password")
            
#             user_obj = User.objects.get(username=username)
#             token = str(uuid.uuid4())
#             profile_obj = Profile.objects.get(user = user_obj, forgot_password_token=token)
#             # profile_obj.forgot_password_token = token
#             profile_obj.save()
#             send_forget_password_mail(user_obj, token)
#             print("mail sented")
#             messages.info(request, "An email is sent.")
#             return redirect("forgot_password")
            
            
            
#     except Exception as e:
#         print(e)
#     return render(request, "forgot_password.html")
