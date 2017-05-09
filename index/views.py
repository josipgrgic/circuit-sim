from django.shortcuts import render


def index(request):
    return render(request, 'index.html', {})

def simulator(request):
    return render(request, 'simulator.html', {})