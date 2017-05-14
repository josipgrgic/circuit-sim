from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^simulator/$', views.simulator, name='simulator'),
    url(r'^tutorial/$', views.tutorial, name='tutorial'),
    url(r'^quiz/$', views.quiz, name='quiz'),
    url(r'^tutorial/lesson$', views.lesson, name='lesson'),

    url(r'^tutorial/lesson/AND$', views.AND, name='AND'),
    url(r'^tutorial/lesson/OR$', views.OR, name='OR'),
    url(r'^tutorial/lesson/NOT$', views.NOT, name='NOT'),
    url(r'^tutorial/lesson/NAND$', views.NAND, name='NAND'),
    url(r'^tutorial/lesson/NOR$', views.NOR, name='NOR'),
    url(r'^tutorial/lesson/XOR$', views.XOR, name='XOR'),

    url(r'^tutorial/lesson/IN$', views.IN, name='IN'),
    url(r'^tutorial/lesson/OUT$', views.OUT, name='OUT'),
    url(r'^tutorial/lesson/CLOCK$', views.CLOCK, name='CLOCK'),
    url(r'^tutorial/lesson/7SEG$', views.SSEG, name='SEG'),
    url(r'^tutorial/lesson/HA$', views.HA, name='HA'),
    url(r'^tutorial/lesson/HS$', views.HS, name='HS'),
    url(r'^tutorial/lesson/FA$', views.FA, name='FA'),
    url(r'^tutorial/lesson/FS$', views.FS, name='FS'),
    url(r'^tutorial/lesson/BCD-7SEG$', views.BCDSEG, name='BCD-7SEG'),
    url(r'^tutorial/lesson/COUNTER$', views.COUNTER, name='COUNTER'),
    url(r'^tutorial/lesson/MUX$', views.MUX, name='MUX'),
    url(r'^tutorial/lesson/DEMUX$', views.DEMUX, name='DEMUX'),
	
	url(r'^tutorial/lesson/D-FLIP-FLOP$', views.DBISTABIL, name='DBISTABIL'),
	url(r'^tutorial/lesson/T-FLIP-FLOP$', views.TBISTABIL, name='TBISTABIL'),
	url(r'^tutorial/lesson/JK-FLIP-FLOP$', views.JKBISTABIL, name='JKBISTABIL'),
	


]
