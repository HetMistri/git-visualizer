/**
 * CTA Component
 *
 * Final call-to-action section encouraging users to get started.
 */

import { Zap, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui";

const CTA = ({ onLaunch }) => {
  return (
    <section className="cta-section">
      <div className="final-cta">
        <h2>Ready to Visualize Your Git Workflow?</h2>
        <p>
          Start exploring git operations in a whole new way. No installation
          required.
        </p>
        <Button
          variant="primary"
          size="large"
          icon={<Zap size={24} />}
          onClick={onLaunch}
        >
          Get Started Now
          <ArrowRight size={24} />
        </Button>
      </div>
    </section>
  );
};

export default CTA;
