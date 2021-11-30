import { getProviders, signIn } from "next-auth/react";

function login({ providers }) {
  return (
    <div className='flex flex-col items-center bg-black min-h-screen w-full justify-center space-y-5'>
      <img
        className='w-52 mb-5'
        src='https://links.papareact.com/9xl'
        alt='Spotify Logo'
      />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
            className='bg-[#18D860] text-white p-4 rounded-xl'>
            Login with Spotify
          </button>
        </div>
      ))}
    </div>
  );
}

export default login;

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
