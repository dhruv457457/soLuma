// api/helius-webhook.ts
import admin from 'firebase-admin';

let app: admin.app.App | null = null;
function initAdmin() {
  if (app) return app;
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svc) throw new Error('FIREBASE_SERVICE_ACCOUNT missing');
  const creds = JSON.parse(svc);
  app = admin.initializeApp({ credential: admin.credential.cert(creds) });
  return app;
}

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') return res.status(200).send('ok'); // health

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).send('Method Not Allowed');
  }

  // 🔐 Verify the Authentication Header (set this in Vercel env)
  const SECRET = process.env.HELIUS_WEBHOOK_SECRET;
  if (SECRET && req.headers.authorization !== SECRET) {
    return res.status(403).send('Forbidden');
  }

  try {
    initAdmin();
    const db = admin.firestore();

    const events = Array.isArray(req.body) ? req.body : [req.body];
    for (const ev of events) {
      const signature: string | undefined = ev?.signature;
      const accountKeys: string[] = ev?.transaction?.message?.accountKeys ?? [];
      const nativeTransfers: any[] = ev?.nativeTransfers ?? [];

      // Lookup reference -> pact/participant
      let found: { pactId: string; index: number; reference: string } | null = null;
      for (const key of accountKeys) {
        const refSnap = await db.collection('pay_refs').doc(key).get();
        if (refSnap.exists) {
          const data = refSnap.data() as any;
          found = { pactId: data.pactId, index: data.index, reference: key };
          break;
        }
      }
      if (!found) continue;

      const pactRef = db.collection('pacts').doc(found.pactId);
      const pactSnap = await pactRef.get();
      if (!pactSnap.exists) continue;

      const pact: any = pactSnap.data();
      const expectedReceiver: string = pact.receiverWallet;
      const expectedAmount: number = Number(pact.amountPerPerson);

      // Validate native SOL transfer to receiver
      let paidOk = false;
      const toReceiver = nativeTransfers.find((t: any) => String(t?.toUserAccount) === expectedReceiver);
      if (toReceiver?.amount) {
        const lamports = Number(toReceiver.amount);
        const sol = lamports / 1_000_000_000;
        if (Math.abs(sol - expectedAmount) < 1e-9) paidOk = true;
      }
      if (!paidOk) continue;

      const participants = pact.participants || [];
      if (!participants[found.index]?.paid) {
        participants[found.index].paid = true;
        participants[found.index].paidTx = signature || '';
        participants[found.index].paidAt = Date.now();
        await pactRef.update({ participants });
        await db.collection('pay_refs').doc(found.reference).delete().catch(() => {});
      }
    }

    res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error('helius-webhook error', e);
    res.status(500).json({ error: e?.message || 'internal' });
  }
}
