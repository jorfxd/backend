from django.shortcuts import render
import requests
import json

# Create your views here.
from django.http import HttpResponse

from django.contrib.auth.decorators import login_required, permission_required

@login_required
@permission_required('main.index_viewer', raise_exception=True)

def index(request):
    #return HttpResponse("Hello, World!")
    #return render(request, 'main/base.html')
    current_url = request.build_absolute_uri()
    url = current_url + '/api/v1/landing'

    response_http = requests.get(url)
    response_dict = json.loads(response_http.content)

    print("Endpoint ", url)
    print("Response ", response_dict)

    total_responses = len(response_dict.keys())

    responses = response_dict.values()

    data = {
        'title': 'Landing - Dashboard',
        'total_responses': total_responses,
        'responses': responses
     }

    return render(request, 'main/index.html', data)
