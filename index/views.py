from django.shortcuts import render


def index(request):
    return render(request, 'index.html', {})

def simulator(request):
    return render(request, 'simulator.html', {})

def tutorial(request):
    return render(request, 'tutorial.html', {})

def notFound(request):
    return render(request, 'notFound.html', {})