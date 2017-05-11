from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^simulator/$', views.simulator, name='simulator'),
    url(r'^tutorial/$', views.tutorial, name='tutorial'),
    url(r'^tutorial/lesson$', views.lesson, name='lesson'),
    url(r'^tutorial/howTo$', views.howTo, name='howTo'),


]
