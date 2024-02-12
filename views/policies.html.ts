import { html } from 'hono/html'

import { layout } from '../views/_layout'

export const view = () =>
	layout(html`
    <a class="s-back" href="/">← MALRO.org</a>

    <h1 class="i-headlines__title">Policies and Legal Stuff</h1>
    <h1 class="i-headlines__subtitle">The rough print and the fine print</h1>

    <hr class="i-separator" />
    <h1 class="i-title">Privacy Policy</h1>

    <p class="i-text"><i>Last updated: September 10, 2023</i></p>

    <p class="i-text">
      MALRO is committed to protecting the privacy of its users. This Privacy Policy explains what information we
      collect, how it is used, and how it is protected. By using or accessing MALRO, you agree to the terms. If you do
      not agree to the terms of this Privacy Policy, please do not use MALRO.
    </p>

    <p class="i-subtitle">Information We Collect</p>
    <p class="i-text">
      MALRO may collect analytics data about your use of the website/app, such as the duration of your sessions and the
      cultural events you look after. We use a GDPR-compliant tool to do so.
    </p>

    <p class="i-subtitle">How We Use Your Information</p>
    <p class="i-text">
      The analytics data we collect is used to improve the website/app and your overall experience. We may also use it
      to identify and fix bugs or other issues.
    </p>

    <p class="i-subtitle">Data Protection</p>
    <p class="i-text">
      MALRO does not collect any personally identifiable information except email for some users (cultural operators).
      All data is collected and stored in a secure manner, and we take appropriate measures to protect it from
      unauthorized access or disclosure.
    </p>

    <p class="i-subtitle">Changes to this Policy</p>
    <p class="i-text">
      MALRO reserves the right to update this Privacy Policy at any time. We will notify you of any changes via the
      website/app or other means, and your continued use of the website/app after such notification constitutes your
      acceptance of the revised policy.
    </p>

    <hr class="i-separator" />
    <h1 class="i-title">Until the End of the Internet</h1>

    <p class="i-text"><i>Last updated: September 10, 2023</i></p>

    <p class="i-text">
      Internet services disappear all the time. It’s become a risky venture to place trust and data in services that
      could disappear at any moment, for any reason, and with no guarantee that data will be safe, preserved, or even
      portable. We want more for Arts & Culture.
    </p>

    <p class="i-text">We’re dedicated to supporting MALRO forever or until the last user turns off the lights.</p>

    <hr class="i-separator" />
    <h1 class="i-title">MALRO Developer & User Agreement</h1>

    <p class="i-text"><i>Last updated: September 10, 2023</i></p>

    <p class="i-text">
      This MALRO Developer & User Agreement (“Agreement”) is a binding agreement between you (referred to in this
      Agreement as “you”) and MALRO and governs your access to and use of the Material (defined below). By accessing or
      using any Material (defined below), or using and accessing MALRO application, website and service, you agree to be
      bound by the terms of the Agreement. If you do not understand the Terms, or do not accept any part of them, then
      you may not use or access any Material. If you are accepting this Agreement or using the Material on behalf of a
      company, organization, government, or other legal entity, you represent and warrant that you have the authority to
      bind such company, organization, government, or entity to this Agreement, in which case the words “you” and “your”
      as used in this Agreement shall refer to such entity.
    </p>

    <h1 class="i-subtitle">I. Definitions. In this Agreement, the following definitions apply:</h1>
    <p class="i-text">
      (1) “Site” means MALRO's website, application and service provided or located at https://malro.org. (2)
      “Intellectual Property Rights” means all copyrights, moral rights, patent rights, trademarks, and any other
      intellectual property or similar rights (registered or unregistered) throughout the world. (3) “Material” means,
      individually or collectively, the MALRO API and MALRO content/database. (4) “Services” means your services,
      websites, applications, and other offerings that display MALRO Content or otherwise use the Material. (5) “Users”
      means visitors or users of your Services.
    </p>

    <h1 class="i-subtitle">II. Attribution 4.0 International (CC BY 4.0)</h1>
    <p class="i-text">
      Subject to your compliance with the terms of this Agreement, Materials are licensed under the
      <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a>. Therefore, by using MALRO,
      you license your data under CC BY 4.0 apart from the images which remain all rights reserved.
    </p>

    <h1 class="i-subtitle">III. API Rate Limits</h1>
    <p class="i-text">
      You will not attempt to exceed or circumvent limitations on access, calls and use of the MALRO API ("Rate
      Limits"), or otherwise use the MALRO API in a manner that exceeds reasonable request volume, constitutes excessive
      or abusive usage, or otherwise does not comply with this Agreement. If you exceed or MALRO reasonably believes
      that you have attempted to circumvent Rate Limits, controls to limit use of the MALRO APIs or the terms of this
      Agreement, then your ability to use the Material may be temporarily suspended or permanently blocked. MALRO may
      monitor your use of the MALRO API to improve the Material and MALRO Applications and to ensure your compliance
      with this Agreement.
    </p>

    <h1 class="i-subtitle">IV. Updates and Removals</h1>
    <p class="i-text">
      Updates — MALRO may update, modify or discontinue any features or function of the Material, in whole or in part,
      from time to time (in each instance, an “Update”). You shall implement and use the most current version of the
      Material and make any changes to your Services that are required as a result of the Update, at your sole expense.
      Updates may adversely affect the way your Services access or communicate with the MALRO API or display MALRO
      Content. MALRO will not be liable for damages of any sort that result from any Update.
    </p>
    <p class="i-text">
      Removals — If MALRO Content is deleted, gains protected status, or is otherwise suspended, withheld, modified, or
      removed from the MALRO Applications, you will make all reasonable efforts to delete or modify that MALRO Content
      (as applicable) as soon as possible. MALRO reserves the right to remove any content at any time.
    </p>

    <h1 class="i-subtitle">V. Betas and Feedback</h1>
    <p class="i-text">
      Betas — MALRO may provide you with early access to non-generally available alphas, betas, research studies,
      pilots, marketing services or other programs from time to time (each, a “Beta”). Betas will be considered MALRO
      Confidential Information. Your participation in any Beta is at your own risk, may be subject to additional
      requirements, and may assist MALRO in research, analyzing and validating existing or prospective programs,
      products and/or tools.
    </p>
    <p class="i-text">
      Feedback — MALRO will be free to use any feedback, comments or suggestions you provide MALRO related to MALRO, the
      Material, Betas or any other of MALRO’s products or services (“Feedback”) in any way without any compensation or
      obligation to you or any third party, and Feedback will be deemed the Confidential Information of MALRO. You
      hereby irrevocably assign to MALRO all right, title, and interest to Feedback.
    </p>

    <h1 class="i-subtitle">VI. Disclaimer</h1>
    <p class="i-text">
      To the maximum extent permissible by applicable law, the material is provided to you “as is”, “where is”, with all
      faults, and MALRO disclaims all warranties, whether express, implied, statutory, or otherwise, including without
      limitation warranties of merchantability, noninfringement, fitness for a particular purpose, and any warranties or
      conditions arising out of this agreement, course of dealing or usage of trade. MALRO does not warrant that the
      material or any other MALRO product or service provided hereunder will meet any of your requirements or that use
      of such material or other products or services will be error-free, uninterrupted, virus-free or secure. You are
      responsible for your use of the material and any content you provide.
    </p>

    <h1 class="i-subtitle">VII. Limitation of Liability</h1>
    <p class="i-text">
      In no event will MALRO be liable to you or any users for any indirect, special, incidental, exemplary, punitive or
      consequential damages or any loss of or damage to use, data, business, goodwill or profits arising out of or in
      connection with this agreement.
    </p>

    <h1 class="i-subtitle">VIII. Agreement Updates</h1>
    <p class="i-text">
      MALRO may update or amend this Agreement or any of the Terms from time to time. You will check the MALRO Site
      regularly for updates. MALRO will alert you of material revisions to these terms by posting the updated terms on
      these sites, via a service notification, or by other suitable means (e.g., via email to an email address
      associated with your account). The changes will not be retroactive, and the most current version of the MALRO
      Agreement, available at the MALRO Site, will govern your access to and use of the Material and any corresponding
      transactions. Your continued access or use of the Material will constitute binding acceptance of such updates and
      modifications.
    </p>
    <p class="i-text">
      If you have any questions or concerns about these Policies, please contact us at info@malro.org.
    </p>
  `)
