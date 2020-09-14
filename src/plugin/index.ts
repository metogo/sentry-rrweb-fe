import * as rrweb from 'rrweb'
import * as Sentry from '@sentry/browser'
import { Dsn } from '@sentry/types'
import { v4 as uuidv4 } from 'uuid'


type RRWebEvent = {
  type: rrweb.EventType;
  data: {};
  timestamp: number;
  delay?: number;
};

export default class SentryRRWeb {
  public readonly name: string = SentryRRWeb.id;
  public static id: string = 'SentryRRWeb';
  public once: boolean = true
  public uuid: string = ''
  public ip: string = ''

  public events: Array<RRWebEvent> = [];
  private readonly checkoutEveryNms: number;
  private readonly checkoutEveryNth: any;

  // defaults to true
  private readonly maskAllInputs: boolean;

  public constructor({
    checkoutEveryNms,
    checkoutEveryNth,
    maskAllInputs = true,
  }: {
    checkoutEveryNms?: number;
    checkoutEveryNth?: number;
    maskAllInputs?: boolean;
  } = {}) {
    // default checkout time of 5 minutes
    this.checkoutEveryNms = checkoutEveryNms || 5 * 60 * 1000;
    this.checkoutEveryNth = checkoutEveryNth;
    this.maskAllInputs = maskAllInputs;
  }

  public attachmentUrlFromDsn(dsn: Dsn, eventId: string) {
    const { host, path, projectId, port, protocol, user } = dsn;
    console.log(host);
    return `${protocol}://${host}${port !== '' ? `:${port}` : ''}${
      path !== '' ? `/${path}` : ''
      }/api/${projectId}/events/${eventId}/attachments/?sentry_key=${user}&sentry_version=7&sentry_client=rrweb`;
  }

  public setupOnce() {
    rrweb.record({
      checkoutEveryNms: this.checkoutEveryNms,
      checkoutEveryNth: this.checkoutEveryNth,
      maskAllInputs: this.maskAllInputs,
      emit(event: RRWebEvent, isCheckout?: boolean) {
        const self: any = Sentry.getCurrentHub().getIntegration(SentryRRWeb);
        if (isCheckout) {
          self.events = [event];
        } else {
          self.events.push(event);
        }
      },
    });

    Sentry.addGlobalEventProcessor((event: any) => {
      const self = Sentry.getCurrentHub().getIntegration(SentryRRWeb);
      if (!self) return;
      try {
        // short circuit if theres no events to replay
        if (!self.events.length) return;
        const client: any = Sentry.getCurrentHub().getClient();
        const endpoint = self.attachmentUrlFromDsn(
          client.getDsn(),
          event.event_id
        );
        console.log(endpoint);
        const formData = new FormData();
        formData.append(
          'rrweb',
          new Blob([JSON.stringify({ events: self.events })], {
            type: 'form-data',
          }),
          'rrweb.json'
        );
        if (this.once) {
          this.once = false
          this.uuid = uuidv4()
          Sentry.captureMessage(this.uuid);
        }
        fetch(`http://172.21.21.152:3000/apis/record/create?uuid=${this.uuid}`, {
          method: 'POST',
          body: formData,
          mode: 'cors'
        }).catch((ex) => {
          console.log('into  error ==================>')
          // we have to catch this otherwise it throws an infinite loop in Sentry
          console.error(ex);
        });
        return event;
      } catch (ex) {
        console.error(ex);
      }
    });
  }
}
