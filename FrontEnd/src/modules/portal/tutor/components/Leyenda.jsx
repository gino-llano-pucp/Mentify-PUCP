

export default function Leyenda() {
	return (
		<div className='flex flex-row items-center gap-[16px]'>
		<div className='leyenda flex flex-row gap-[8px]'>
			<div style={{
				width: "20px",
				height: "20px",
				borderRadius: "50%",
				border: "4px solid #00C1BC",
				backgroundColor: "#99E6E4"
			}}></div>
			<div className="text-sm">
				Zona disponible
			</div>
		</div>
		<div className='leyenda flex flex-row gap-[8px]'>
			<div style={{
				width: "20px",
				height: "20px",
				borderRadius: "50%",
				border: "4px solid #8667F1",
				backgroundColor: "#E5E8FB"
			}}></div>
			<div className="text-sm">
				Cita programada
			</div>
		</div>
		<div className='leyenda flex flex-row gap-[8px]'>
			<div style={{
				width: "20px",
				height: "20px",
				borderRadius: "50%",
				border: "4px solid #22B14C",
				backgroundColor: "#79E07F"
			}}></div>
			<div className="text-sm">
				Cita completada
			</div>
		</div>
	</div>
	)
}