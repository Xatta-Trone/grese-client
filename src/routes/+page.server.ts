// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
// export const prerender = true;

export const load = async ({ locals,parent }) => {
    await parent()
    console.log("locals.user in home page")
    console.log(locals.user)
    // route guard
    // user.subscribe((value) => {
    //   if (value == null) {
    //     redirectHelper('/')
    //   }
    // });

};
