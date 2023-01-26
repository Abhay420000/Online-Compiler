from django.shortcuts import render
from django.http import HttpResponse
import json
#from django.views.decorators.csrf import csrf_exempt
#import os
#print(os.getcwd())
from ExecuteC.Input_Output.exeC import execute
from django.views.decorators.csrf import ensure_csrf_cookie

# Create your views here.
@ensure_csrf_cookie
def home(request):
    if request.method == "GET":
        #print(request.GET)
        return render(request, "ExecuteC/index.html")
    elif request.method == "POST":
        #print(request.POST)
        #print(request)
        body_unicode = request.body.decode('utf-8')
        body = json.loads(body_unicode)
        #print(body)
        to_send = json.dumps(execute(body['language'], body["code"], body["input"]))
        #print("Respose:", to_send)                                       
        return HttpResponse(to_send, content_type="application/json")