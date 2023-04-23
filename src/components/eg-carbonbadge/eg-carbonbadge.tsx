import { Component, Host, Prop, State, h } from '@stencil/core';
import { WCResponse } from '../../utils/utils';

@Component({
  tag: 'eg-carbonbadge',
  styleUrl: 'eg-carbonbadge.scss',
  shadow: true,
})
export class EgCarbonbadge {
  @Prop() theme: string = 'notDark';
  @Prop() url: string;
  @State() cachedResponse: string;
  @State() responseJSON: WCResponse;
  encodedUrl: string;
  coValue: string;
  percentage: string;
  wcbg = 'Measuring CO<sub>2</sub>&hellip;';
  wcb2 = '&nbsp;';
  isDark: boolean;

  componentWillLoad() {
    this.isDark = this.theme === 'dark';
  }

  newRequest = (render: boolean = true) => {
    // Run the API request because there is no cached result available
    fetch(`https://api.websitecarbon.com/site?url=${this.encodedUrl}`, {
      method: 'GET',
    })
      .then(r => r.json())

      .then((r: WCResponse) => {
        this.responseJSON = r;
        if (render) {
          this.mountComponentText(this.responseJSON);
        }

        // Save the result into localStorage with a timestamp
        localStorage.setItem('wcb_' + this.encodedUrl, JSON.stringify(this.responseJSON));
      })

      // Handle error responses
      .catch(e => {
        console.log(e);
        localStorage.removeItem('wcb_' + this.encodedUrl);
      });
  };

  formatAsPercentage = (num: number) => {
    return new Intl.NumberFormat('default', {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  mountComponentText = (response: WCResponse) => {
    this.percentage = this.formatAsPercentage(response.cleanerThan);
    this.coValue = response.green ? response.statistics.co2.renewable.grams.toFixed(2) : response.statistics.co2.grid.grams.toFixed(2);
    this.wcbg = `${this.coValue}g of CO<sub>2</sub>/view`;
    this.wcb2 = `Cleaner than ${this.percentage} of pages tested`;
  };

  componentWillRender() {
    this.encodedUrl = encodeURIComponent(this.url);
    this.cachedResponse = localStorage.getItem('wcb_' + this.encodedUrl);

    const t = new Date().getTime();
    // If there is a cached response, use it
    if (this.cachedResponse) {
      const r: WCResponse = JSON.parse(this.cachedResponse);
      this.mountComponentText(r);

      // If time since response was cached is over a day, then make a new request and update the cached result in the background
      if (t - r.timestamp > 86400000) {
        this.newRequest(false);
      }

      // If no cached response, then fetch from API
    } else {
      this.newRequest();
    }
  }

  render() {
    return (
      <Host>
        <div
          id="wcb"
          class={{
            'carbonbadge': true,
            'wcb-d': this.isDark,
          }}
        >
          <div id="wcb_p">
            <span id="wcb_g" innerHTML={this.wcbg}></span>
            <a id="wcb_a" target="_blank" rel="noopener" href="https://websitecarbon.com">
              Website Carbon
            </a>
          </div>
          <span id="wcb_2" innerHTML={this.wcb2}></span>
        </div>
      </Host>
    );
  }
}
