export default function (req, res) {
  res
    .status(501)
    .json({
      status: 501,
      ok: false
    });
}
