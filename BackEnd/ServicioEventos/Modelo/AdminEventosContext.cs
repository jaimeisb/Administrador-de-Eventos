using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ServicioEventos.Modelo;

public partial class AdminEventosContext : DbContext
{
    public AdminEventosContext()
    {
    }

    public AdminEventosContext(DbContextOptions<AdminEventosContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Evento> Eventos { get; set; }

    public virtual DbSet<Invitacion> Invitacions { get; set; }

    public virtual DbSet<InvitacionConfirmacion> InvitacionConfirmacions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("cadena");
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Evento>(entity =>
        {
            entity.HasKey(e => e.IdEvento);

            entity.ToTable("EVENTO");

            entity.Property(e => e.IdEvento).HasColumnName("ID_EVENTO");
            entity.Property(e => e.Anfitrion)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("ANFITRION");
            entity.Property(e => e.Correo)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("CORREO");
            entity.Property(e => e.Fecha)
                .HasColumnType("datetime")
                .HasColumnName("FECHA");
            entity.Property(e => e.MensajeInvitacion)
                .HasMaxLength(1000)
                .IsUnicode(false)
                .HasColumnName("MENSAJE_INVITACION");
        });

        modelBuilder.Entity<Invitacion>(entity =>
        {
            entity.HasKey(e => e.IdInvitacion);

            entity.ToTable("INVITACION");

            entity.Property(e => e.IdInvitacion).HasColumnName("ID_INVITACION");
            entity.Property(e => e.Adultos).HasColumnName("ADULTOS");
            entity.Property(e => e.Estado)
                .HasMaxLength(1)
                .IsUnicode(false)
                .HasColumnName("ESTADO");
            entity.Property(e => e.FechaExpiracion)
                .HasColumnType("datetime")
                .HasColumnName("FECHA_EXPIRACION");
            entity.Property(e => e.IdEvento).HasColumnName("ID_EVENTO");
            entity.Property(e => e.Menores).HasColumnName("MENORES");
            entity.Property(e => e.Nombre)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("NOMBRE");
            entity.Property(e => e.Telefono)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("TELEFONO");
            entity.Property(e => e.Telefono)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("TELEFONO");

            entity.HasOne(d => d.IdEventoNavigation).WithMany(p => p.Invitacions)
                .HasForeignKey(d => d.IdEvento)
                .HasConstraintName("FK_INVITACION_EVENTO");
        });

        modelBuilder.Entity<InvitacionConfirmacion>(entity =>
        {
            entity.HasKey(e => e.IdInvitacion);

            entity.ToTable("INVITACION_CONFIRMACION");

            entity.Property(e => e.IdInvitacion)
                .ValueGeneratedNever()
                .HasColumnName("ID_INVITACION");
            entity.Property(e => e.AdultosConfirmados).HasColumnName("ADULTOS_CONFIRMADOS");
            entity.Property(e => e.MenoresConfirmados).HasColumnName("MENORES_CONFIRMADOS");

            entity.HasOne(d => d.IdInvitacionNavigation).WithOne(p => p.InvitacionConfirmacion)
                .HasForeignKey<InvitacionConfirmacion>(d => d.IdInvitacion)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_INVITACION_CONFIRMACION_INVITACION");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
