import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MplCorePractice } from "../target/types/mpl_core_practice";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

describe("create-core-asset-example", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const wallet = anchor.Wallet.local();
  const program = anchor.workspace.MplCorePractice as Program<MplCorePractice>;

  let asset = Keypair.generate();

  it("Create Asset", async () => {
    let createAssetArgs = {
      name: "ORANGE",
      uri: "https://arweave.net/81LcNgxns6EUQe8rsZF1cNcbpJRCC7otvgnHvprRC2ft",
    };

    const createAssetTx = await program.methods
      .createCoreAsset(createAssetArgs)
      .accountsPartial({
        asset: asset.publicKey,
        collection: null,
        authority: null,
        payer: wallet.publicKey,
        owner: null,
        updateAuthority: null,
        systemProgram: SystemProgram.programId,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
      })
      .signers([asset, wallet.payer])
      .rpc();

    console.log(createAssetTx);

    await program.methods
      .createCoreAsset(createAssetArgs)
      .accountsPartial({
        asset: asset.publicKey,
        collection: null,
        authority: null,
        payer: wallet.publicKey,
        owner: null,
        updateAuthority: null,
        systemProgram: SystemProgram.programId,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
      })
      .signers([asset, wallet.payer])
      .rpc();
  });
});
