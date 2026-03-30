# User Guide

## Getting Started

### For Admin Users
1. Login with admin credentials
2. Access Dashboard for system overview
3. Manage users in Settings → Users
4. Configure system settings
5. View and export financial reports

### For Attendants (Clerks)
1. Login with attendant credentials
2. Use POS for customer transactions
3. Check inventory levels
4. Issue customer receipts
5. View daily sales summary

### For AI Technicians
1. Login with technician credentials
2. Access AI Services module
3. View scheduled appointments
4. Record service details
5. Track semen inventory
6. Schedule follow-up visits

### For Veterinarians
1. Login with vet credentials
2. Access Veterinary module
3. Record consultation details
4. Manage prescriptions
5. Track treatment progress

## Module Guides

### Dashboard
The dashboard provides a real-time overview of business metrics.

**Key Widgets:**
- Today's Sales: Total revenue from today's transactions
- Inventory Health: Value and status of stock
- Low Stock Alerts: Products below reorder level
- Upcoming Appointments: AI services scheduled
- Outstanding Credits: Farmer credit summary
- Total Farmers: Active farmer count

**Actions:**
- Click on any metric for detailed view
- Generate reports for date range
- Export data to CSV/PDF

### Inventory Management

#### Viewing Products
1. Go to Inventory → Products
2. Filter by category (Seeds, Fertilizers, etc)
3. Search by name or SKU
4. View quantity, price, reorder status

#### Adding New Product
1. Click "Add Product" button
2. Fill product details:
   - Product Name
   - SKU (unique identifier)
   - Category
   - Unit Price
   - Quantity in Stock
   - Reorder Level
   - Unit of Measurement
3. Add optional image
4. Click Save

#### Batch Tracking
1. Go to Inventory → Batches
2. Select product
3. Enter batch details:
   - Batch Number
   - Quantity
   - Expiry Date
   - Location
4. System highlights items expiring soon

#### Low Stock Alerts
- System automatically alerts when quantity ≤ reorder level
- View in Dashboard alerts section
- Click to create purchase order

### Point of Sale (POS)

#### Processing a Sale
1. Go to POS module
2. Scan/search for products
3. Add to cart:
   - Click product
   - Enter quantity
   - Item added to cart
4. Review cart total
5. Apply discount if applicable
6. Select payment method:
   - Cash
   - M-Pesa (requires phone number)
   - Credit (for registered farmers)
7. Complete transaction
8. Print receipt

#### Customer Credit
1. At checkout, select "Credit" payment
2. Enter customer phone number
3. System looks up farmer profile
4. Verifies credit limit
5. Records transaction in credit ledger
6. Updates outstanding balance

#### Receipt Management
- Receipts print automatically
- View receipt history in POS → Receipts
- Reprint previous receipts
- Email receipts if email available

#### Daily Sales Report
1. Go to POS → Reports
2. Select date range
3. View:
   - Total sales count
   - Total revenue
   - Payment method breakdown
   - Top products
4. Export report

### AI Services Module

#### Farmer Management

**Adding Farmer:**
1. Go to AI Services → Farmers
2. Click "Add Farmer"
3. Enter farmer details:
   - Full Name
   - Phone Number
   - Location/Region
   - Number of Cows
   - Note about farm
4. Set credit limit (if applicable)
5. Save farmer

**Viewing Farmer:**
1. Search/select farmer from list
2. View profile with:
   - Contact information
   - Number of cows
   - Credit balance
   - Recent services
   - Veterinary history

#### Cow Management

**Adding Cow:**
1. Open farmer profile
2. Click "Add Cow"
3. Enter cow details:
   - Cow Name
   - Breed (Friesian, Ayrshire, Jersey, etc)
   - Date of Birth
   - ID Number (if available)
   - Color/Markings
4. Save cow

**Tracking Cow:**
- View last heat date
- Track last service date
- See expected delivery date
- Check current status (healthy, pregnant, treated)

#### Service Recording

**Recording AI Service:**
1. Go to AI Services → Services
2. Click "New Service"
3. Select Farmer
4. Select Cow
5. Enter service details:
   - Heat date observed
   - Select semen straw (by breed/bull)
   - Note observation index (1-5)
   - Add any notes
6. Record service date (today by default)
7. Set cost
8. Save service

**Follow-Up Scheduling:**
- System suggests 21-day pregnancy check
- Set reminder date
- Technician receives SMS reminder
- Record pregnancy result when checked

#### Semen Inventory

**Viewing Inventory:**
1. Go to AI Services → Semen Tank
2. Filter by breed
3. View:
   - Breed and bull ID
   - Quantity available
   - Expiry dates
   - Temperature monitoring
4. Track usage

**Adding Semen:**
1. Click "Add Semen"
2. Enter:
   - Breed type
   - Bull ID and Name
   - Origin
   - Quantity
   - Expiry date
   - Tank location
3. Save straw

### Veterinary Consultations

#### Recording Consultation

**New Consultation:**
1. Go to Veterinary → Consultations
2. Click "New Consultation"
3. Select farmer
4. Select cow (optional)
5. Enter consultation details:
   - Visit date
   - Diagnosis
   - Prescription
   - Medications given
   - Treatment cost
6. Save consultation

#### Prescription Management
- View medication history
- Print prescriptions
- Track dosage for follow-up
- Record compliance/results

#### Follow-up Visits
- Schedule follow-up date
- System sends reminders
- Record outcomes on follow-up
- Track treatment effectiveness

### Credit Management

#### Viewing Credit Ledger
1. Go to Farmers → Select Farmer
2. View Credit Ledger tab
3. See all transactions:
   - Date and description
   - Amount (debit/credit)
   - Running balance
   - Payment status

#### Recording Payment
1. Click "Record Payment"
2. Enter:
   - Payment amount
   - Payment date
   - Payment method
   - Reference number
3. System updates balance
4. Marks credit as paid

#### Credit Reports
1. Go to Reports → Credit Management
2. Filter by:
   - Date range
   - Status (pending, paid, overdue)
   - Farmer
3. View:
   - Total outstanding
   - Overdue amount
   - Payment trends

### Reports & Analytics

#### Available Reports
1. **Daily Sales** - Transaction summary
2. **Inventory Report** - Stock levels, value
3. **AI Services Report** - Services by technician
4. **Veterinary Report** - Consultations, costs
5. **Credit Management** - Outstanding balances
6. **Farmer Activity** - Purchase/service history

#### Generating Reports
1. Select report type
2. Choose date range
3. Apply filters
4. Click Generate
5. View or export (PDF/CSV)

#### Exporting Data
- PDF format for printing
- CSV format for spreadsheets
- Email report to address
- Schedule recurring reports

## Tips & Best Practices

1. **Daily Backups**: System auto-backs up nightly
2. **Password Security**: Change password monthly
3. **Logout**: Always logout when leaving computer
4. **Batch Updates**: Enter multiple items for efficiency
5. **Customer Notes**: Add notes for transaction context
6. **Phone Format**: Use consistent format (+254XXX format)
7. **Receipt Review**: Check receipt before customer leaves
8. **Low Stock**: Order when items reach reorder level
9. **Expiry Tracking**: Monitor batch expiry dates weekly
10. **AI Records**: Complete service records same day

## Troubleshooting

### Can't Login
- Verify username/email
- Check Caps Lock
- Verify password
- Contact admin if account locked

### Product Not Finding
- Check exact SKU
- Try partial name search
- Verify product exists (may be deleted)

### Receipt Won't Print
- Check printer connection
- Select correct printer
- Verify paper in tray
- Restart application

### M-Pesa Payment Issue
- Verify phone number format
- Check mobile money balance
- Verify network connection
- Contact payment provider

### Low Performance
- Clear browser cache
- Refresh page
- Check internet speed
- Report to IT support

## FAQ

**Q: How do I reset my password?**
A: Click "Forgot Password" on login screen, enter email, follow reset link.

**Q: Can I edit a completed transaction?**
A: No, transactions are immutable for audit trail. Contact admin for adjustments.

**Q: How is pricing calculated?**
A: Unit Price × Quantity ± Discount + Tax = Total

**Q: What's the maximum credit limit?**
A: No limit, set by admin per farmer's profile.

**Q: Can I delete a product?**
A: Only if no inventory. Otherwise mark as inactive.

**Q: How are SMS reminders sent?**
A: Automatically to farmer's phone 2 days before pregnancy check date.

**Q: Is data backed up?**
A: Yes, daily automatic backups retained for 30 days.
