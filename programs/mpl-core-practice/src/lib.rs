use anchor_lang::prelude::*;

declare_id!("F7DomzpikdQQ4D9tHwN2PxBCKAdFCBu51HrkUBznUUYq");

#[program]
pub mod mpl_core_practice {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
