import { isDataURL } from "@/utils/isDataURL";
import useHashAndData from "@/hooks/useHashAndData";

const ShowUserData = ({ data }) => {
  return Object.keys(data).map((key, index) => {
    return (
      <div key={index}>
        <b>{key}:</b>
        {isDataURL(data[key]) ? <iframe src={data[key]} /> : data[key]}
      </div>
    );
  });
};

const ShowUserCertificates = ({ certificates }) => {
  return certificates.map((certificate, index) => {
    return (
      <div key={index}>
        <ShowUserData data={certificate} />
      </div>
    );
  });
};

export default function DisplayDoctorData({ address }) {
  // get hash
  const { data, certificates } = useHashAndData("getDrHash", address || null);

  return (
    <div>
      <br />
      <ShowUserData data={data} />
      <br />
      <b>Certificates:</b>
      <ShowUserCertificates certificates={certificates} />
    </div>
  );
}
