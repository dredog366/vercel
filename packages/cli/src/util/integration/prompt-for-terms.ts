import output from '../../output-manager';
import type Client from '../client';
import type { AcceptedPolicies, Integration } from './types';

const MARKETPLACE_ADDENDUM_URL = 'https://vercel.com/docs/marketplace/addendum';

export async function promptForTermAcceptance(
  client: Client,
  integration: Integration
): Promise<AcceptedPolicies | null> {
  const addendumAccepted = await client.input.confirm(
    `Accept Vercel Marketplace End User Addendum? (${MARKETPLACE_ADDENDUM_URL})`,
    false
  );
  if (!addendumAccepted) {
    output.error(
      'Vercel Marketplace End User Addendum must be accepted to continue.'
    );
    return null;
  }

  const acceptedPolicies: AcceptedPolicies = {
    toc: new Date().toISOString(),
  };

  if (integration.privacyDocUri) {
    const accepted = await client.input.confirm(
      `Accept privacy policy? (${integration.privacyDocUri})`,
      false
    );
    if (!accepted) {
      output.error('Privacy policy must be accepted to continue.');
      return null;
    }
    acceptedPolicies.privacy = new Date().toISOString();
  }

  if (integration.eulaDocUri) {
    const accepted = await client.input.confirm(
      `Accept terms of service? (${integration.eulaDocUri})`,
      false
    );
    if (!accepted) {
      output.error('Terms of service must be accepted to continue.');
      return null;
    }
    acceptedPolicies.eula = new Date().toISOString();
  }

  return acceptedPolicies;
}
