import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorExample } from "../target/types/anchor_example";
import { Keypair } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

describe("anchor-example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const wallet = anchor.Wallet.local();
  const program = anchor.workspace.AnchorExample as Program<AnchorExample>;

  const collection = new anchor.web3.PublicKey("ADqLTbh3cTBB7YKSZTsTgvDVJzvGQMtzmyE2CEWECURR");
  const asset = Keypair.generate()
  console.log("Asset address: " + asset.publicKey.toBase58());

  it("Create Asset!", async () => {
    const tx = await program.methods.createAsset()
    .accountsPartial({
      signer: wallet.publicKey,
      payer: wallet.publicKey,
      asset: asset.publicKey,
      collection: collection,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
    })
    .signers([wallet.payer, asset])
    .rpc();

    console.log(tx);
  });
});