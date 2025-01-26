from django.shortcuts import render
import requests
import json

from collections import Counter
from datetime import datetime

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
    lista_responses=list(responses)
    
    primero = lista_responses[0] if responses else None

    segundo = lista_responses[-1] if responses else None

    def extract_datetime(response):
        saved = response.get("saved", "")
        if saved:
            return saved  # Ya está en formato "día/mes/año, hora"
        return None
    
    first_response = extract_datetime(primero) if primero else None
    last_response = extract_datetime(segundo) if segundo else None

    dates = []
    for key, value in response_dict.items():
        saved_date = value.get("saved", None)
        if saved_date:
            # Extraer solo la fecha (día/mes/año) ignorando la hora
            date_only = saved_date.split(",")[0].strip()
            dates.append(date_only)
    # Contar ocurrencias por día
    day_with_most_responses = None
    if dates:
        day_counts = Counter(dates)
        day_with_most_responses = max(day_counts, key=day_counts.get)

    data = {
        'title': 'Landing - Dashboard',
        'total_responses': total_responses,
        'responses': responses,
        'first_response': first_response,
        'last_response':last_response,
        'high_rate_day': day_with_most_responses,
     }

    return render(request, 'main/index.html', data)
