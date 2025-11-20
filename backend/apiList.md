## API list


## authRoutes
- POST/signup
- POST/login
- POST/logout

## profileRoutes
- GET/profile/view
- PATCH/profile/edit
- PATCH/profile/change-password


## connectionRequestRoutes
- POST/request/send/intrested/:userId
- POST/request/ignore/:userId
- POST/request/review/accept/:requestId
- POST/request/review/reject/:requestId

## userRoutes
- GET/user/connection
- GET/user/requests
- GET/user/feet - get the profile of other user in plateform


status : ignore, intrested, accepted, rejected