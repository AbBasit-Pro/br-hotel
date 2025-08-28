const PDFDocument = require("pdfkit");
const Guest = require("../models/Guest");
const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const Payment = require("../models/Payment");
const GuestHistory = require("../models/GuestHistory");

exports.generateReport = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const reservation = await Reservation.findById(reservationId)
      .populate("guest")
      .populate("room");

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const guest = reservation.guest;
    const payments = await Payment.find({ reservation: reservation._id });
    const history = await GuestHistory.findOne({ reservation: reservation._id });

    // Create PDF
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reservation_report.pdf");
    doc.pipe(res);

    // Header
    doc.fontSize(20).fillColor("#1a237e").text("Guest Registration Card", { align: "center" });
    doc.moveDown(1);

    // Date + Guest ID
    doc.fontSize(10).fillColor("black").text(`Date: ${new Date().toLocaleDateString()}`, { align: "right" });
    doc.text(`Guest ID: ${guest.guestId || "-"}`, { align: "right" });
    doc.moveDown();

    // Guest Info Section
    doc.fontSize(12).fillColor("#0d47a1").text("Guest Information", { underline: true });
    doc.fillColor("black").fontSize(11);
    doc.text(`Name: ${guest.firstName} ${guest.lastName}`);
    doc.text(`Contact No: ${guest.contactNo || "-"}`);
    doc.text(`Nationality: ${guest.nationality || "-"}`);
    doc.text(`CNIC: ${guest.cnicNo || "-"}`);
    doc.text(`Email: ${guest.email || "-"}`);
    doc.text(`Company: ${guest.companyName || "-"}`);
    doc.text(`Passport No: ${guest.passportNo || "-"}`);
    doc.text(`Place of Issue: ${guest.placeOfIssue || "-"}`);
    doc.text(`Reference: ${guest.reference || "-"}`);
    doc.text(`Expiry Date: ${guest.expiryDate ? guest.expiryDate.toDateString() : "-"}`);
    doc.text(`Address: ${guest.address || "-"}`);
    doc.moveDown();

    // Reservation Info
    doc.fontSize(12).fillColor("#0d47a1").text("Reservation Details", { underline: true });
    doc.fillColor("black").fontSize(11);
    doc.text(`Room No: ${reservation.room.roomNumber}`);
    doc.text(`Room Type: ${reservation.room.type}`);
    doc.text(`Room Rent: ${reservation.room.pricePerNight}`);
    doc.text(`Total Rooms: ${reservation.totalRooms}`);
    doc.text(`Advance Receipt: ${reservation.advanceReceipt}`);
    doc.text(`Check-In: ${reservation.checkIn?.toDateString()}`);
    doc.text(`Check-Out: ${reservation.checkOut?.toDateString()}`);
    doc.text(`Arrival: ${reservation.arrivalDate?.toDateString()} at ${reservation.arrivalTime || "-"}`);
    doc.text(`Departure: ${reservation.departureDate?.toDateString()} at ${reservation.departureTime || "-"}`);
    doc.text(`Stay Duration: ${reservation.stayDuration || "-"}`);
    doc.text(`Estimated Stay: ${reservation.estimatedStay || "-"}`);
    doc.text(`Remarks: ${reservation.remarks || "-"}`);
    doc.text(`Status: ${reservation.status}`);
    doc.moveDown();

    // Payment Info
    doc.fontSize(12).fillColor("#0d47a1").text("Payment Information", { underline: true });
    doc.fillColor("black").fontSize(11);
    if (payments.length > 0) {
      payments.forEach((p, i) => {
        doc.text(
          `#${i + 1} - Amount: ${p.amount} | Method: ${p.method} | Status: ${p.status} | Date: ${
            p.paymentDate ? p.paymentDate.toDateString() : "-"
          }`
        );
        doc.text(`Coming From: ${p.comingFrom || "-"}`);
        doc.text(`Billing Instructions: ${p.billingInstructions || "-"}`);
        doc.moveDown(0.5);
      });
    } else {
      doc.text("No payments recorded.");
    }
    doc.moveDown();

    // Guest History Info
    if (history) {
      doc.fontSize(12).fillColor("#0d47a1").text("Guest History", { underline: true });
      doc.fillColor("black").fontSize(11);
      doc.text(`Room Number: ${history.roomNumber}`);
      doc.text(`Rent Paid: ${history.rentPaid}`);
      doc.moveDown();
    }

    // Terms & Conditions
    doc.fontSize(12).fillColor("#0d47a1").text("Terms & Conditions", { underline: true });
    doc.fillColor("black").fontSize(10);
    const terms = [
      "01- Check-in time is 14:00, Check-out time is 12:00 Noon.",
      "02- Early check-in before 09:00 may incur full night charges.",
      "03- Late check-out after 18:00 will incur 50% or full night charges.",
      "04- Number of guests cannot exceed booked occupancy.",
      "05- Safe locker is provided but hotel not liable for valuables.",
      "06- Costs will be recovered for damage or excessive soiling.",
      "07- Smoking prohibited in rooms.",
      "08- Govt. taxes applicable on all rates.",
      "09- Visitors not allowed after 22:00 hrs.",
      "10- Outside food is not allowed inside rooms.",
      "11- Deposit and valid photo ID required at check-in.",
      "12- Hotel reserves right of admission."
    ];
    terms.forEach(t => doc.text(t));

    // Footer
    doc.moveDown(2);
    doc.text("Guest Signature: ____________________", { align: "left" });
    doc.text("Receptionist Signature: ____________________", { align: "right" });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating report" });
  }
};
