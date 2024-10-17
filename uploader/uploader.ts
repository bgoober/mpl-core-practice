import { create, mplCore } from '@metaplex-foundation/mpl-core'
import {
  createGenericFile,
  generateSigner,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const createNft = async () => {
  //
  // ** Setting Up Umi **
  //

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplCore())
    .use(
      irysUploader({
        // mainnet address: "https://node1.irys.xyz"
        // devnet address: "https://devnet.irys.xyz"
        address: 'https://devnet.irys.xyz',
      })
    )

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

  // Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the filesystem wallet method or change rpcs.
  console.log('Airdropping 1 SOL to identity')
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // ** Upload an image to Arweave **
  //

  // use `fs` to read file via a string path.
  // You will need to understand the concept of pathing from a computing perspective.

  const imageFile = fs.readFileSync(
    path.join('./0.png')
  )

  // Use `createGenericFile` to transform the file into a `GenericFile` type
  // that umi can understand. Make sure you set the mimi tag type correctly
  // otherwise Arweave will not know how to display your image.

  const umiImageFile = createGenericFile(imageFile, '0.png', {
    tags: [{ name: 'Content-Type', value: 'image/png' }],
  })

  // Here we upload the image to Arweave via Irys and we get returned a uri
  // address where the file is located. You can log this out but as the
  // uploader can takes an array of files it also returns an array of uris.
  // To get the uri we want we can call index [0] in the array.
  console.log('Uploading Image...')
  const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
    throw new Error(err)
  })

  console.log('imageUri: ' + imageUri[0])

  //
  // ** Upload Metadata to Arweave **
  //

  const metadata = {
    name: 'rugzy blue',
    description: 'don\'t ask',
    image: imageUri[0],
    external_url: 'https://example.com',
    attributes: [
      {
        trait_type: 'main color',
        value: 'blue',
      },
      {
        trait_type: 'off color',
        value: 'tie dye',
      },
    ],
    properties: {
      files: [
        {
          uri: imageUri[0],
          type: 'image/jpeg',
        },
      ],
      category: 'image',
    },
  }

  // Call upon umi's `uploadJson` function to upload our metadata to Arweave via Irys.

  console.log('Uploading Metadata...')
  const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
    throw new Error(err)
  })

  //
  // ** Creating the NFT **
  //

  // We generate a signer for the NFT
  const asset = generateSigner(umi)

  console.log('Creating NFT...')
  const tx = await create(umi, {
    asset,
    name: 'rugzy blue',
    uri: metadataUri,
  }).sendAndConfirm(umi)

  // Finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(tx.signature)[0]

  // Log out the signature and the links to the transaction and the NFT.
  console.log('\nNFT Created')
  console.log('View Transaction on Solana Explorer')
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  console.log('\n')
  console.log('View NFT on Metaplex Explorer')
  console.log(`https://core.metaplex.com/explorer/${signer.publicKey}?env=devnet`)
}

createNft()

function irysUploader(arg0: {
    // mainnet address: "https://node1.irys.xyz"
    // devnet address: "https://devnet.irys.xyz"
    address: string
}): any {
    throw new Error('Function not implemented.')
}
