import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { WorkoutsContextProvider } from './context/WorkoutContext'
import { AuthContextProvider } from './context/AuthContext'
import { ProductsContextProvider } from './context/ProductContext';
import { ReceiptsContextProvider } from './context/ReceiptContext';
import { DealersContextProvider } from './context/DealerContext';
import { FarmerMeetingsContextProvider } from './context/FarmerMeetingContext';
import { VisitsContextProvider } from './context/VisitContext';
import { OrdersContextProvider } from './context/OrderContext';
import { PolicysContextProvider } from './context/PolicyContext';
import firebase from "firebase/compat/app"

const firebaseConfig = {
  apiKey: "AIzaSyDGi5FUEr8BRyrTuFuEVm_I0_o_wYjYRuI",
  authDomain: "biosales-5e5e9.firebaseapp.com",
  projectId: "biosales-5e5e9",
  storageBucket: "biosales-5e5e9.appspot.com",
  messagingSenderId: "314499115440",
  appId: "1:314499115440:web:d99970039cb10a83800e75"
};

firebase.initializeApp(firebaseConfig);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <ProductsContextProvider>
          <ReceiptsContextProvider>
            <DealersContextProvider>
              <FarmerMeetingsContextProvider>
                <VisitsContextProvider>
                  <OrdersContextProvider>
                    <PolicysContextProvider>
                  <App />
                    </PolicysContextProvider>
                  </OrdersContextProvider>
                </VisitsContextProvider>
              </FarmerMeetingsContextProvider>
            </DealersContextProvider>
          </ReceiptsContextProvider>
        </ProductsContextProvider>
      </WorkoutsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);