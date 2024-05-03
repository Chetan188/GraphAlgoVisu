from django.shortcuts import render, redirect
from  django.http import HttpResponse
from .models import *
from django.contrib import messages
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

def index(request):
    myposts = DocumentPost.objects.all()
    return render(request,"index.html", {'myposts': myposts})

def docpostfe(request, id):
    # docs_obj = DocumentPost.objects.all()
    myposts = DocumentPost.objects.all()
    post = DocumentPost.objects.filter(docpost_id = id)[0]
    
    # page = request.GET.get('page', 1)
    # paginator = Paginator(docs_obj, 1)
    # try:
       
    #     docs_obj = paginator.page(page)
    # except PageNotAnInteger:
    #     docs_obj = paginator.page(1)
    # except EmptyPage:
    #     docs_obj = paginator.page(paginator.num_pages)
    context = {
        'post': post,
        'myposts': myposts,
    }
 
    # obj=Item.objects.all()
    return render(request,"docpostfe.html", context)


