# Car Dealership

## Description

The Car Dealership App is a console-based application that facilitates the purchasing of cars. An employee can add cars to the lot and manage offers for those cars, while a customer can views the cars on the lot and make offers.

## User Stories

- As a user, I can login, and register for a customer account.
- As a customer, I can view the cars on the lot and make an offer for a car.
- As a customer, I can view the cars that I own and view remaining payments for a car.
- As an employee, I can add or remove a car to the lot, accept or reject a pending offer for a car.
- As an employee, I can view all payments history for a customer.
- As the system, I reject all other pending offers for a car when an offer is accepted.
- As the system, I update a car to an owned state and calculate the monthly payment for a car when an offer is accepted.

## Technology Used

- NodeJS
- TypeScript
- AWS SDK and DynamoDB

## Getting Started

- requirement: AWS account with DynamoDB full access policy attached to IAM
- `git clone https://github.com/michaelwoo921/21-07-22-dealership.git`
- `npm install` in project folder then
- `npm run setup` for DynamoDB table setup
- `npm start`

### Selected ScreenShots

A
To use the app first setup DynamoDB table:
![Setup](/Screenshots/setup.png 'Setup')

register or login:
![Login](/Screenshots/login.png 'Login')

Making an offer as a Customer:
![Make an Offer](/Screenshots/offer.png 'Make an Offer')

Accept or Reject an Offer as an Employee:
![Accept an Offer](/Screenshots/accept.png 'Process an Offer')
