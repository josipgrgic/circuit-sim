from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^simulator/$', views.simulator, name='simulator'),
    url(r'^tutorial/$', views.tutorial, name='tutorial'),
    url(r'^.*$', views.notFound, name="notFound")

]
