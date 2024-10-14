import NextAuth, { CredentialsSignin } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

class InvalidLoginError extends CredentialsSignin {
  code = 'Invalid identifier or password';
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        identifier: {},
        password: {}
      },
      // logica de verificar credenciales en la db
      // pero se usara tambien para generar jwt y enviar datos del usuario
      authorize: async (credentials) => {
        console.log(credentials);
        // TODO: Borrar try catch, en caso de q la respuesta no sea ok, throw Error con el error que llega del backend
        // ese error tiene que ser descriptivo como AccesoDenegado lo cual implica que usuario o contra son incorrectos (no se tiene q decir q no existe en el ssitema por motivos de privacidad)
        // u otro error como 500 de servidor en caso algo en el sv haya pasado y eso se mapea aqui en el front
        let res;
        try {
          // fetch(`${process.env.API_HOST}/google-auth/`
          res = await fetch(`${process.env.API_HOST}/local-auth/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              identifier: credentials.identifier,
              password: credentials.password
            }),
            cache: 'no-store' // Correctly placed inside the options object
          });

          console.log(res);

          const user = await res.json();
          if (res.ok && user) {
            console.log(user);
            return user; // Permitir el inicio de sesión
          }

          throw new Error(user.message || 'Authentication failed');
        } catch (error) {
          console.log(res);
          console.log('aqui viene?');
          /* throw new Error("User not found 12345."); */
          throw new InvalidLoginError();
        }
      }
    })
  ],
  callbacks: {
    // Se invoca cuando se crea o actualiza un JWT
    // cuando ocurre el inicio de sesion o se accede a una sesion en el cliente
    async jwt({ token, user }) {
      console.log('entra?');
      console.log('exp 1: ', token.accessTokenExp);
      // Guarda el access token y refresh token en el JWT en el login inicial
      if (user) {
        token.id = user.id;
        token.accessToken = user.access_token;
        token.refreshToken = user.refresh_token;
        token.accessTokenExp = user.access_token_expires_at;
        return token;
      } else if (token.accessTokenExp == undefined || Date.now() < token.accessTokenExp * 1000) {
        console.log('entonces entra aqui');
        console.log('exp 2: ', token.accessTokenExp);
        /* token.accessTokenExp = 1715267460; */
        // el token aun no expira, devuelvelo
        return token;
      } else {
        console.log('exp 3: ', token.accessTokenExp);
        // Si el token expira, refrescalo
        const refreshResponse = await fetch(`${process.env.API_HOST}/usuario/refresh-token/`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token.refreshToken}`
          },
          cache: 'no-store'
        });
        console.log('pasa 1');
        const { accessToken, refreshToken, accessTokenExpiresAt, error } = await refreshResponse.json();
        console.log('pasa 2');
        if (refreshResponse.ok && accessToken && refreshToken) {
          // Asociar el nuevo access token con el usuario para uso posterior
          token.accessToken = accessToken;
          token.refreshToken = refreshToken;
          token.accessTokenExp = accessTokenExpiresAt;
        } else {
          console.error('Error refreshing token:', error);
        }
        console.log('pasa 3');
        return token;
      }
    },
    // Se llama cada vez que se verifica una sesion (cuando se usa auth())
    session({ session, token }) {
      console.log('pasa 4');
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      console.log('session:', session);
      return session;
    },
    // luego de login exitoso, pasos adicionales como obtener jwt tokens - roles, etc
    async signIn({ account, profile, user }) {
      // Verificar si el inicio de sesión es con Google
      if (account.provider === 'google') {
        /* console.log("ruta post: ", `${process.env.API_HOST}/google-auth/`);
        console.log("account token: ", account.id_token); */
        const res = await fetch(`${process.env.API_HOST}/google-auth/`, {
          method: 'POST',
          body: JSON.stringify({ id_token: account.id_token }),
          headers: { 'Content-type': 'application/json' },
          cache: 'no-store'
        });

        const { access_token, refresh_token, access_token_expires_at, error } = await res.json();

        if (res.ok && access_token && refresh_token) {
          // Asociar los tokens con el usuario para uso posterior
          user.access_token = access_token;
          user.refresh_token = refresh_token;
          user.access_token_expires_at = access_token_expires_at;
          console.log(user);
          return true; // Permitir el inicio de sesión
        } else {
          return false; // Detener el flujo si hay un error
        }
      } /* else if (account.provider === 'credentials') {
        // Llamar a tu API de backend para autenticar y obtener información del usuario
        const res = await fetch(`${process.env.API_HOST}/get-user-info/`, {
          method: 'POST',
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          }),
          headers: { 'Content-type': 'application/json' },
        });
      } */
      // Si el proveedor no es Google, permitir el inicio de sesión sin modificaciones adicionales
      return true;
    },
    pages: {
      signIn: '/login',
      error: '/login'
    }
  }
});
