import Appointments from "./appointmentModel.js";
import User from "../user/userModel.js";
import sgMail from "@sendgrid/mail";

const Appointment = async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    existingPatient,
    phoneNumber,
    DOB,
    gender,
    address1,
    address2,
    city,
    state,
    country,
    postalCode,
    slot,
    haveRecordId,
    reason,
  } = req.body;
  const user = await User.findById(id);

  if (user) {
    if (
      firstName &&
      lastName &&
      existingPatient &&
      phoneNumber &&
      DOB &&
      gender &&
      address1 &&
      address2 &&
      city &&
      state &&
      country &&
      postalCode &&
      slot &&
      haveRecordId &&
      reason
    ) {
      try {
        const newUser = new Appointments({
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          email: null,
          existingPatient: existingPatient,
          DOB: DOB,
          gender: gender,
          address1: address1,
          address2: address2,
          city: city,
          state: state,
          country: country,
          postalCode: postalCode,
          slot: slot,
          haveRecordId: haveRecordId,
          reason: reason,
        });
        const appoint = await newUser.save();
        appointmentMail(appoint, user?.email);
        res.status(200).json({
          success: true,
          message: "Appointment",
        });
      } catch (error) {
        console.log(error.message);
        res.status(500).json({
          success: false,
          mesaage: "Something wents wrong",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Please fill empty fields",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "User does not exist",
    });
  }
};

const ContactUs = async (req, res) => {
  const { firstName, email, phoneNumber, message } = req.body;

  const user = await User.findOne({ email: email });
  if (firstName && email && phoneNumber && message && user) {
    contactUsMail(firstName, phoneNumber, message, user?.email);
    res.status(200).json({
      success: true,
      message: "Email send successfully",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Please fill empty fields",
    });
  }
};

export { Appointment, ContactUs };

const appointmentMail = (user) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "Admin@yourtelerx.com",
    from: {
      name: "YourTeleRX",
      email: "ziaareact@gmail.com",
    }, // Use the email address or domain you verified above
    subject: "Welcome to YourTeleRX.",
    text: `You have successfully made appointment to YourTeleRX.`,
    html: `<h1 style="text-transform: capitalize[;font-size:16px">Name: <span style="font-weight:600"> ${user?.firstName} </span></h1> 
    <p style="text-transform: capitalize"> Existing Patient: <span style="font-weight:600"> ${user?.existingPatient}</span></p> 
    <p style="text-transform: capitalize"> Phone Number: <span style="font-weight:600"> ${user?.phoneNumber}</span></p> 
    <p style="text-transform: capitalize"> Date of Birth:<span style="font-weight:600"> ${user?.DOB}</span></p> 
    <p style="text-transform: capitalize"> Gender:<span style="font-weight:600"> ${user?.gender}</span></p> 
    <p style="text-transform: capitalize"> Address 1:<span style="font-weight:600"> ${user?.address1}</span></p> 
    <p style="text-transform: capitalize"> Address 2:<span style="font-weight:600"> ${user?.address2}</span></p> 
    <p style="text-transform: capitalize"> City:<span style="font-weight:600"> ${user?.address2}</span></p> 
    <p style="text-transform: capitalize"> State:<span style="font-weight:600"> ${user?.state}</span></p> 
    <p style="text-transform: capitalize"> Country:<span style="font-weight:600">  ${user?.country}</span></p> 
    <p style="text-transform: capitalize"> Postal Code:<span style="font-weight:600"> ${user?.postalCode}</span></p> 
    <p style="text-transform: capitalize"> Have Record ID:<span style="font-weight:600"> ${user?.haveRecordId}</span></p> 
    <p style="text-transform: capitalize"> Slot: date:<span style="font-weight:600"> ${user?.slot.date}</span>:: time:<span style="font-weight:600"> ${user?.slot.time}</span></p> 
    <p style="text-transform: capitalize"> Reason:<span style="font-weight:600"> ${user?.reason}</span></p>`,
  };
  try {
    sgMail.send(msg);
  } catch (error) {
    console.log(error);
    return error;
  }
};

const contactUsMail = (firstName, phoneNumber, message, email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "Admin@yourtelerx.com",
    from: {
      name: "YourTeleRX",
      email: "ziaareact@gmail.com",
    }, // Use the email address or domain you verified above
    subject: "Welcome to YourTeleRX.",
    text: `You have successfully made appointment to YourTeleRX.`,
    html: `<p style="text-transform: capitalize[;font-size:16px">Name: <span style="font-weight:600"> ${firstName} </span></p> 
    <p style="text-transform: capitalize"> Email: <span style="font-weight:600"> ${email}</span></p> 
    <p style="text-transform: capitalize"> Phone Number: <span style="font-weight:600"> ${phoneNumber}</span></p> 
    <p style="text-transform: capitalize"> Message:<span style="font-weight:600"> ${message}</span></p> `,
  };
  try {
    sgMail.send(msg);
  } catch (error) {
    console.log(error);
    return error;
  }
};
