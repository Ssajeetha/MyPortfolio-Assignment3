
const auth = {
  // 1. Save credentials when user logs in
  authenticate(jwt, cb) {
    if (typeof window !== "undefined") {
      localStorage.setItem('jwt', JSON.stringify(jwt));
    }
    cb();
  },

  // 2. Check if a user is currently signed in
  isAuthenticated() {
    if (typeof window === "undefined") return false;
    if (localStorage.getItem('jwt')) {
      return JSON.parse(localStorage.getItem('jwt'));
    }
    return false;
  },

  // 3. Clear credentials when user signs out
  clearJWT(cb) {
    if (typeof window !== "undefined") {
      localStorage.removeItem('jwt');
    }
    cb();
  }
};

export default auth;