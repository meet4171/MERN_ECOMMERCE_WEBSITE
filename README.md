
# MERN ECOMMERCE WEBSITE
   ✨TrendCart is an ecommerce website which has some of the feature of real time ecommerce website like amazon or flipkart.✨  
   
🔗<a href="https://meetjadav.shop/" target="blank">Click to See Live Demo of Website</a>


**🔥  Features**
--

- **Login | Signup | Reset Password** 
    - Sign up to create new account.
    - Login if already a user.
    - In case of Login/Signup credentials will be checked by    backend.
    - Once Login / Signup user will be Authorized for next 1 hr , further re-login is necessary.
    - Reset Password will be done by `Gmail` , user will get a link to reset the password.     

- **Authorization and Authentication**
    - If your Authentication is <span style='color:green'>Successfully</span> than only user can access any api or website else user will be redirected to login page.
    - Once user is Authenticated you can access the website for next 1hr than you need to re-login.

- **Products | Product Detial**
    - List of Products will be displayed on home page , if api takes time to fetch the product , products skeleton will be displayed.
    - Deleted products cannot be seen by normal user `only Admin can`.
    - Products out of stock will be shown but cannot be purchased.
    - If user clicks on any product user will get details of the products such as price , rating , discount , images etc.. 
    - All the things related to product are dynamic under control of Admin. 
- **Sort | Filter | Pagination** 
    - User can sort the product based on price ( low to high and high to low ) and rating.       
    - User can Filter Products on the basis of Brand and Category
        (. multiple filter applicable )
    - Pagination will be there if there is more number of Products. 

- **Cart**
    - User can add product to cart from product detail page.
    - User cannot add two same items to cart and also the quantity of any item in cart will be based on Stock.
    - Number of items in cart will be displayed on Navbar.
    - If cart is empty user will be redirected to home page.
    - Cart will be displayed on the basis of loggedIn user.
    - User can change the quantity of any product from cart or remove any product from cart.

- **Checkout**
     - On Checkout Page user will be shown all the cart items. 
    - user can remove cart item from checkout page or can also change quantity ( based on stock ).
    - user can add or remove shipping address ( minimum one  address is required)

- **Stripe Payment Gateway**
    - There are two payment Method available :
        - Cash On Delivery
        - Card
    - For Cards Stripe Payment Gateway is integrated.
    - If there is any error while Payment from Card than user will be notified about it and redirected accordingly.
    
- **Automated Mail**
    - On <span style='color:green'>Successfull</span> purcahse you will be notified on your Gamil with purchase detials.
    - Reset Password link will also be send on `Gamil`.

- **User Profile Page**
    - User can visit to user profile page where User can see the shipping information of user and other details. 
    - User can add / remove / edit shipping addresses from user profile page.

- **User Orders Page**
    - All the orders will be shown on this page.
    - Date/time of order with the current status of order will be shown
        - Dispached
        - Cancalled
        - Out for Dilevery
        - Pending 
- **Admin User**  
    Admin user can
    - Add New Product
    - Delete any Product
    - Edit any exisiting Product
    - Check All Orders
    - Update Status of Any Order
    **Overall control of website is under the admin user , but admin user can only be created manually by the authorized person who has direct control to database.**  

- **Banners | Carousel**
    - Website also has a audotisment/offers Carousel and the banner of company logos whose products are available on website.

**🛠️ Tools and Technology💻**  
--
**Client :**   
React | Redux | Redux toolkit | TailwindCSS | TailwindComponents | Stripe | React-Hook-Form | React-Hot-Toast | React-Avatar | React-Loading-Skeleton | React-Router-Dom 

**Server :**  
Node JS | Express JS | Mongodb | Mongoose | Cors | jsonwebtoken | Passport JS | EJS | Nodemailer | Bcrypt | Vercel 

**📥 Installation**
--

⚠️ Here MERN_ECOMMERCE_WEBSITE is the backend code and build folder inside it is Fronted build , our Fronted is statically hosted by our express server. MERN_ECOMMERCE_WEBSITE_FRONTEND is frontend code repo.  


Clone Project with 

```bash
git clone https://github.com/meet4171/MERN_ECOMMERCE_WEBSITE.git
  ```

Go to the project directory

```bash
  cd MERN_ECOMMERCE_WEBSITE
```  

Install dependencies

```bash
  npm install
```
⚠️ Before running the project change the `.env-dummy` file to `.env` and replace all the dummy value with your own value accordingly.  

Start the server

```bash
  npm run start
```
✨ Frontend Code
-- 
 - If you want to make any changes in frontend than 

 Clone Fronted code with 

```bash
git clone https://github.com/meet4171/MERN_ECOMMERCE_WEBSITE_FRONTEND.git
  ```

Go to the project directory

```bash
  cd MERN_ECOMMERCE_WEBSITE_FRONTEND
```  

Install dependencies

```bash
  npm install
```

- After installation make changes as per you need and run the command

```bash
  npm run build
```

- Replace the build folder in the MERN_ECOMMERCE_WEBSITE ( backend ) with the newly created build folder in frontend.

- 😊 You are good to go..

![image](https://github.com/meet4171/README/blob/main/assets/gifs/marquee.svg)



