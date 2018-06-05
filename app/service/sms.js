'use strict';

const _ = require('lodash');
const moment = require('moment');
const Service = require('egg').Service;

class SmsService extends Service {

  async sendCaptcha(mobile) {
    const ctx = this.ctx;

    const { mock, provider } = ctx.app.config.smsVerify;
    const captcha = mock ? mock : '' + _.random(1000, 9999);

    await ctx.model.SmsVerify.create({
      mobile,
      captcha,
    });

    if (mock) {
      return;
    }

    if (provider.type === 'yunpian') {
      const result = await ctx.curl(provider.api, {
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
        ctx.throw(500, '调用云片网发送短信接口失败', { code: 'REQUEST_YP_FAIL', errors: result });
      }
    } else {
      ctx.throw(500, '不支持的短信提供商', { code: 'INVALID_SMS_PROVIDER', errors: provider });
    }
  }

  async checkCaptcha({ mobile, captcha }) {
    const ctx = this.ctx;

    const { Op } = ctx.app.Sequelize;
    const { ttl } = ctx.app.config.smsVerify;

    const count = await ctx.model.SmsVerify.count({
      where: {
        mobile,
        captcha,
        created_at: {
          [Op.gte]: moment().add(ttl * -1, 'minutes').toDate(),
        },
      },
    });

    return count > 0;
  }
}

module.exports = SmsService;
