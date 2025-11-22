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
- POST/request/send/:status//:userId  => status = [intrested , ignored]
- 
- POST/request/review/:status/:requestId =>  => status = [accepted  , rejected]

## userRoutes
- GET/user/connection
- GET/user/requests
- GET/user/feet - get the profile of other user in plateform


status : ignore, intrested, accepted, rejected