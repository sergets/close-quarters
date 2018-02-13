# the-more-the-merrier
A naive sessions counter to avoid conflicting requests to shared resources.

Imagine you need to simultaneously test several instances of frontend that are assigned to the same huge backend (and it is hard to create another instance of that backend). You want to prevent two or more instances from altering same data objects on the backend.

So a tested frontend instance should know its unique number, but that number cannot be determined internally since multiple instances can be run by different people in different environments simultaneously.

So you just can set up a single `the-more-the-merrier` server, and obtain session numbers from it.

### Usage
````
make install
make run LISTEN=8080
````
It sets up a server with following API:

 - `POST /foo`      returns a new session number for key `foo`
 - `GET /foo`       shows active session numbers for key `foo`
 - `DELETE /foo/n`  frees session number `n` for key `foo`
 - `DELETE /foo`    frees all session numbers for key `foo` 

### Example 
````
> POST /test
< 0

> POST /test
< 1

> POST /test
< 2

> GET /test
< [0,1,2]

> DELETE /test/1
< [0,2]

> POST /test
< 1

> GET /test
< [0,1,2]

> DELETE /test/3
< [0,1,2]

> DELETE /test
< []
````
