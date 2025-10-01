// firebase/admin.js
import admin from 'firebase-admin';

// Evitar que se inicialice más de una vez
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID=dashboard-360-f96c0,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL= "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDd1bNgFyq06Lxg\nhG28dyMCqvdPQ5OVxy3rvTQQQxgC5huH/gwYOUBnWQ9fG2aZ7g8kHr7rcxBsHMpr\nLnZ1PMm0dKxZU+TT89nuShUTXcrGjtJqxcoR3CrY9X2qHhaQhb9tQyWS1MDHmb6q\njj6xaZ9Woed6De4E6+s0Qjd5uqOf5/WuVo2MtxTGjHBlK1PRxb234lMmHUagUdOR\niPKqHbMjHQp0gXsbIPNV/aSrBvj/lkjJ6jSi+Cn+7D1SuFyyDaeseYnKuFej9pLK\nHnhUziRMEYVWwNFLlEMWV8C4viDBq14UqdmA9cYUF0IH50I6xI4UHL2N4vS3sTnk\nk3olghsZAgMBAAECggEAZhN6HTq7y5AWcoEtb54QjZ82+pG5XR/QeRvQU7VT3K2e\nuIaFcTYS9RtNj/FvVmBtNi0xo+0H/v+GgyhXmN3WYMOZNOd+MauROe174jPz5Ub9\n+uS1dV9ulfPslbWPo4Pv0Gqn5PciGBaeXiPjJEbaa4ZHmenD/x7B1YOsvEZOGXtL\nP9hQ/iAcvtrhb0gESg0uRa082vKUrPRkYolRxLjG3NtV/uTvxAo0yHz8x4uXhabh\nLHHXIGTPczqMMigUPmIskT/9hzqC1OtEquQ2NFQvYQnuoh1xzxiXbA2NizZsELze\nauTOYAgttrqb9B6Zn7UcAPUFX5/WQPDgmmzYndbtwwKBgQDym4zMFgVKj3fsAnb4\ng9ZVDuGKWCiwVjBDv6FqexUAsMHCZ0Fu/2VXEcoj1lxVqw4waXFNLm9ImcOBfvWE\n5qwP8exxon2XyRVIWfkqI9vp94f3EevQMP6g+vrFmuFM7Hv5AtDcE0VQkEwA/QjU\nveBT60X9a+7PP5HPdHQN9E6tuwKBgQDqFJiA7i5jlkrQm3vjDEkPFb5Sx5oWqSGo\nEuHSC+1YOVV9KnC7CtgYz9S820ST7dLN+MlzrOKyJzxbVa3uV3jyTIywU2Mx6y/I\nthi09ZMhuzbHDlPTvO8lVn5veUo6TGfoya4pEVuSGjvwvhsuhrYbz4RSw0LEyyhA\no7t7DyajOwKBgQDEV40QUjYADLJCKBB+ubvJZNy1aPmtFGPFQJ5zHZ92ypZVLdmv\n6jPqznPoowBhOKmoFn3it9TKTd8Cu2waHdFcqi7wHFBGei+mOWLEbvb4mCLKmw9c\nk3pPcC9poxn5dl4yvcuogFQVimJoXmA6RFz7raocGbDQu6LW4WlXLcRLJwKBgCmn\nTJP0zlBuWBXS9TKr5vxGND3qwuKxagnMgl6sPKnsWegR+0ltXpLbuNF6ezOPqGl6\nke6Bnz1wee8OygqVijIjqQ1faVFitngS30akRHBGLjMxu3z8K9oLECip/qltGzhz\nWwh3zEGtZWkriw62bgV44eUQVftK43jNKfl18rwtAoGBAN2aAzmyqdB73YXYwr07\nioCAyfO8B4Wg2gWnPEF6DaFeWqg8Sg+4fI/G8AW/I4uuLxMzQCsUq8PRoKu+goOc\nxr55BpsK/bheDYKbIZqSUZjP2Am0Vg65E5vzhbmNoU9YbsiaCbCEdn2268LzdLiz\nrghQu9ZrnriIG2A0fT0YSI3B\n-----END PRIVATE KEY-----\n",
      // Reemplaza los caracteres de escape para que la clave sea válida
      privateKey: process.env.GOOGLE_PRIVATE_KEY= "dashboard-sheets-manager@dashboard-360-f96c0.iam.gserviceaccount.com",
    }),
  });
}

export default admin;