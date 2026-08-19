export interface ILoan {
  id: string;
  usuario: string;
  producto: string;
  fechaInicio: string;
  fechaLimite: string;
  estado: 'Activo' | 'Vencido' | 'Cancelado';
}
