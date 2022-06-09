import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
    render(<ContactForm />)
});

test('renders the contact form header', () => {
    // Arrange
    render(<ContactForm />)
    
    // Act
    const header = screen.getByText(/contact form/i);
    
    // Assert
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header.textContent).toEqual("Contact Form")

});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />)

    const firstNameInput = screen.getByLabelText(/first name\*/i);
    userEvent.type(firstNameInput, "1234");
    
    const error = await screen.findByText(/error/i);

    expect(error).toBeInTheDocument();

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />)

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const errors = await screen.findAllByText(/error/i);

    expect(errors.length).toEqual(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />)

    const firstNameInput = screen.getByLabelText(/first name\*/i);
    const lastNameInput = screen.getByLabelText(/last name\*/i);
    const submitButton = screen.getByRole("button");

    userEvent.type(firstNameInput, "Timothy");
    userEvent.type(lastNameInput, "Sansone");
    userEvent.click(submitButton);

    
    const error = await screen.findByText(/error/i);
    expect(error).toBeInTheDocument();

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);

    const emailInput = screen.getByLabelText(/email\*/i);
    userEvent.type(emailInput, "timothy");

    const errorMessage = await screen.findByText(/email must be a valid email address/i)

    expect(errorMessage).toBeInTheDocument()
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />)

    const firstNameInput = screen.getByLabelText(/first name\*/i);
    const emailInput = screen.getByLabelText(/email\*/i);
    const submitButton = screen.getByRole("button");

    userEvent.type(firstNameInput, "Timothy");
    userEvent.type(emailInput, "tim.sansone@gmail.com");
    userEvent.click(submitButton);

    const error = await screen.findByText(/lastname is a required field/i);
    expect(error).toBeInTheDocument();
    
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />)

    const firstNameInput = screen.getByLabelText(/first name\*/i);
    const lastNameInput = screen.getByLabelText(/last name\*/i);
    const emailInput = screen.getByLabelText(/email\*/i);
    const submitButton = screen.getByRole("button");

    userEvent.type(firstNameInput, "Timothy");
    userEvent.type(lastNameInput, "Sansone");
    userEvent.type(emailInput, "tim.sansone@gmail.com");
    userEvent.click(submitButton);

    const displayFirstName = await screen.findByText(/Timothy/);
    const displayLastName = await screen.findByText(/Sansone/);
    const displayEmail = await screen.findByText(/tim\.sansone@gmail\.com/);
    const instancesOfMessage = await screen.findAllByText(/message/i);

    expect(displayFirstName).toBeInTheDocument();
    expect(displayLastName).toBeInTheDocument();
    expect(displayEmail).toBeInTheDocument();
    expect(instancesOfMessage.length).not.toEqual(2);

});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />)

    const firstNameInput = screen.getByLabelText(/first name\*/i);
    const lastNameInput = screen.getByLabelText(/last name\*/i);
    const emailInput = screen.getByLabelText(/email\*/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button");

    userEvent.type(firstNameInput, "Timothy");
    userEvent.type(lastNameInput, "Sansone");
    userEvent.type(emailInput, "tim.sansone@gmail.com");
    userEvent.type(messageInput, "Hello World");
    userEvent.click(submitButton);

    const displayFirstName = await screen.findByText(/Timothy/);
    const displayLastName = await screen.findByText(/Sansone/);
    const displayEmail = await screen.findByText(/tim\.sansone@gmail\.com/);
    const displayMessage = await screen.findByText(/hello world!?/i);

    expect(displayFirstName).toBeInTheDocument();
    expect(displayLastName).toBeInTheDocument();
    expect(displayEmail).toBeInTheDocument();
    expect(displayMessage).toBeInTheDocument();
});
