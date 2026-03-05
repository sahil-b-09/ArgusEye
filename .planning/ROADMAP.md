# Product Roadmap

## Phases

- [ ] **Phase 2.5: Content Pipeline** - Await TV indicator scripts, analyze logic, and write simplified copy for the landing page.
- [ ] **Phase 2.75: Product Animation (Remotion)** - Use the Remotion skill to create programmatic video trailers for the indicators (Gold USD 15m demo).
- [ ] **Phase 3: Checkout & Payment Integration** - Build Razorpay integration (API key setup, webhook listener, order creation).
- [ ] **Phase 4: TradingView Automation** - Automate TV invite-only script access using TradingView's webhook/API infrastructure.

## Phase Details

### Phase 1: Project Setup & Scaffolding
**Goal**: Establish the technical foundation and deployment pipeline.
**Depends on**: Nothing
**Requirements**: N/A
**Success Criteria**:
  1. Frontend and backend boilerplates are initialized and running locally.
  2. Database schema for users/transactions is provisioned on the cloud host.

### Phase 2: UI & Landing Page (UIUX Pro Max)
**Goal**: Deploy a beautiful, premium storefront capturing the ArgusEye brand.
**Depends on**: Phase 1
**Requirements**: WEB-01, WEB-02
**Success Criteria**:
  1. User can land on the homepage and view the premium design.
  2. User can read detailed information about the two trading indicators.

### Phase 2.5: Content Pipeline
**Goal**: Write accurate, simple marketing copy based on the actual PineScript logic.
**Depends on**: User providing the scripts.
**Success Criteria**:
  1. Internalize the 24/7 and HTF scripts.
  2. Update landing page text to reflect the actual mechanics in simple terms.

### Phase 2.75: Product Animation (Remotion)
**Goal**: Create programmatic code-driven video animations showing the indicators in action.
**Depends on**: Remotion Skill imported from GitHub.
**Success Criteria**:
  1. Download and initialize the Remotion Skill for agents.
  2. Implement an animated demo of Argus Eye 24/7 functioning on Gold (XAUUSD) 15m timeframe (Showing Buy/Sell labels, SL, and TP hitting).
  3. Optionally run the browser agent on TradingView to capture real visual data/themes if references are lacking.
  4. Integrate the rendered Remotion videos into the ArgusEye landing page.

### Phase 3: Checkout & Payment Integration (Razorpay)
**Goal**: Securely process payments and capture required user data.
**Depends on**: Phase 2
**Requirements**: PAY-01, PAY-02
**Success Criteria**:
  1. Generate test API keys from Razorpay Dashboard.
  2. Implement backend endpoint (`/api/create-order`) to generate a Razorpay Order ID.
  3. Implement frontend Razorpay Checkout widget capturing Name, Email, Phone, and TradingView Username.
  4. Implement backend webhook receiver to verify payment signatures and listen for `payment.captured` events.

### Phase 4: TradingView Automation
**Goal**: Fulfill orders automatically without manual intervention.
**Depends on**: Phase 3
**Requirements**: AUTO-01, AUTO-02
**Success Criteria**:
  1. Set up a backend service to trigger upon Razorpay's `payment.captured` webhook.
  2. Use TradingView's invite-only script management API (or equivalent programmatic browser automation if no API exists) to add the user's TV Username to the access list.
  3. Log the successful transaction and provisioning status into the Hostinger database.
