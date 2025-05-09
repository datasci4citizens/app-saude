export default function Welcome() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold mb-4 text-green-800">Welcome!</h1>
          <p className="text-gray-600">Você está logado com sucesso. Aproveite o aplicativo!</p>
          <p> Ainda não exite authenticação para essa página, nem para complete-profile</p>
        </div>
      </div>
    );
  }
  