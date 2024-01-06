This is a starter repo for Next.js 14 and firebase/auth projects created as part of a blog post you can read [here.](https://donis.dev/blog/post/next_firebase_auth)

This project utilizes firebase admin  SDK and cookies to persist a user session on the server. Client side firebase/auth only used for signing a user in and getting the token.

Read the blog post and check out the files. Almost everything has comments explaining the logic so make sure to check the actual files.

## Getting started

clone the repository and continue from there with server side firebase auth capabilities.

`git clone https://github.com/donis3/next-firebase-starter.git`

## Protecting a server component / route

After implementing the necessary server actions and `lib/firebase-auth-api` functions, a request to `getAuthAction` can be made to receive a user object to verify an active session

```tsx
const user = (await getAuthAction()) as UserRecord | undefined;
if (!user) {
    console.log("User not logged in");
    return redirect("/user/login");
}
```

Please refer to the [blog post](https://donis.dev/blog/post/next_firebase_auth) and read the file comments for details.