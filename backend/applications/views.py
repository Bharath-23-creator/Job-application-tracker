
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import JobApplication
from .serializers import JobApplicationSerializer


User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def register(request):
    username = request.data.get('username', '').strip()
    email = request.data.get('email', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )
    token, _ = Token.objects.get_or_create(user=user)

    return Response(
        {'token': token.key, 'username': user.username},
        status=status.HTTP_201_CREATED,
    )


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def login(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid username or password.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    token, _ = Token.objects.get_or_create(user=user)

    return Response({'token': token.key, 'username': user.username})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.auth.delete()
    return Response({'message': 'Logged out successfully.'})


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def application_list(request):
    if request.method == 'GET':
        applications = JobApplication.objects.filter(user=request.user)
        serializer = JobApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    serializer = JobApplicationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def application_detail(request, pk):
    application = get_object_or_404(
        JobApplication,
        pk=pk,
        user=request.user,
    )

    if request.method == 'GET':
        serializer = JobApplicationSerializer(application)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = JobApplicationSerializer(
            application,
            data=request.data,
        )
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    application.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
