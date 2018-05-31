'use strict';

const _ = require('lodash');
const Service = require('egg').Service;

class SmsService extends Service {

  async sendCaptcha(mobile) {
    const { mock, provider } = this.ctx.app.config.smsVerify;
    const captcha = mock ? mock : '' + _.random(1000, 9999);

    await this.ctx.model.SmsVerify.create({
      mobile,
      captcha,
    });

    if (mock) {
      return;
    }

    if (provider.type === 'yunpian') {
      const result = await this.ctx.curl(provider.api, {
        method: 'POST',
        dataType: 'json',
        data: {
          apikey: provider.key,
          text: provider.template + captcha,
          mobile,
        },
      });
      // https://www.yunpian.com/doc/zh_CN/domestic/single_send.html
      if (result.data.code !== 0) {
        this.ctx.throw(500, '调用云片网发送短信接口失败', { result });
      }
    } else {
      this.ctx.throw(500, '不支持的短信提供商', { provider });
    }
  }
}

module.exports = SmsService;
