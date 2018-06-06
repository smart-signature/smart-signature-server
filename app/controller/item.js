'use strict';

const Controller = require('egg').Controller;

class ItemController extends Controller {

  async create() {
    const ctx = this.ctx;

    const user_id = ctx.user.id;
    const { valueOptions, ponzi, digiccy } = ctx.request.body;

    const item = {
      digiccy,
      user_id,
      valueOptions,
      ponzi,
    };

    ctx.body = await ctx.service.item.create(item);
  }

  async sync() {
    const ctx = this.ctx;

    const item_id = ctx.params.id;

    ctx.body = await ctx.service.item.sync({ id: item_id });
  }

  async like() {
    const ctx = this.ctx;

    const user_id = ctx.user.id;
    const item_id = ctx.params.id;
    const { value } = ctx.request.body;

    ctx.body = await ctx.service.item.like({
      user_id,
      item_id,
      value,
    });
  }

}

module.exports = ItemController;
