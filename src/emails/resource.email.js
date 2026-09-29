import { sendEmail } from '../utils/sendEmail.js';

// Send notification email to the resource creator upon successful resource creation
export const sendResourceCreatedEmail = async ({ email, name, resource }) => {
  const resourceName = resource?.name || 'New Resource';
  const resourceType = resource?.type || 'Cloud Resource';
  const subject = `Resource Created: ${resourceName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <h2>Hello ${name || 'User'},</h2>
      <p>Your resource <strong>${resourceName}</strong> (${resourceType}) has been successfully created.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Resource ID:</strong> ${resource?._id || resource?.id}</p>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${resourceName}</p>
        <p style="margin: 5px 0;"><strong>Type:</strong> ${resourceType}</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> ${resource?.status || 'provisioning'}</p>
      </div>
      <p>You can manage this resource from your Resource Management Dashboard.</p>
    </div>
  `;

  return await sendEmail({
    to: email,
    subject,
    html
  });
};
