from django.shortcuts import render


def index(request):
    return render(request, 'index.html', {})


def simulator(request):
    return render(request, 'simulator.html', {})


def tutorial(request):
    return render(request, 'tutorial.html', {})


def quiz(request):
    return render(request, 'quiz.html', {})


def lesson(request):
    return render(request, 'lesson.html', {})


def howTo(request):
    return render(request, 'howTo.html', {})


def AND(request):
    return render(request, 'AND.html', {})


def OR(request):
    return render(request, 'OR.html', {})


def NOT(request):
    return render(request, 'NOT.html', {})


def NAND(request):
    return render(request, 'NAND.html', {})


def NOR(request):
    return render(request, 'NOR.html', {})


def XOR(request):
    return render(request, 'XOR.html', {})


def IN(request):
    return render(request, 'IN.html', {})


def OUT(request):
    return render(request, 'OUT.html', {})


def CLOCK(request):
    return render(request, 'CLOCK.html', {})


def SSEG(request):
    return render(request, '7SEG.html', {})


def HA(request):
    return render(request, 'HA.html', {})


def HS(request):
    return render(request, 'HS.html', {})


def FA(request):
    return render(request, 'FA.html', {})


def FS(request):
    return render(request, 'FS.html', {})


def BCDSEG(request):
    return render(request, 'BCDSEG.html', {})


def COUNTER(request):
    return render(request, 'COUNTER.html', {})


def MUX(request):
    return render(request, 'MUX.html', {})


def DEMUX(request):
    return render(request, 'DEMUX.html', {})
	
def DBISTABIL(request):
    return render(request, 'DBISTABIL.html', {})
	
def TBISTABIL(request):
    return render(request, 'TBISTABIL.html', {})
	
def JKBISTABIL(request):
    return render(request, 'JKBISTABIL.html', {})


def notFound(request):
    return render(request, 'notFound.html', {})