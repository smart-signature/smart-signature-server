'use strict';

const Controller = require('egg').Controller;

class ItemController extends Controller {

  async create() {
    const ctx = this.ctx;

    const user_id = ctx.user.id;
    const { valueOptions, ponzi } = ctx.request.body;

    const item = {
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

}

module.exports = ItemController;
